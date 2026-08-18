import { Parser, Store } from 'n3';
import { writable, type Writable } from 'svelte/store';
import type { DatasetMetadata } from '../Types/types';

const COLLECTIONS_URL = '/catalogue-api/Eucaim/api/rdf/Collections';
const COLUMN = 'http://catalogue.eucaim.cancerimage.eu/Eucaim/api/rdf/Collections/column/';
const HOST = 'http://catalogue.eucaim.cancerimage.eu';
const RDFS_LABEL = 'http://www.w3.org/2000/01/rdf-schema#label';
const MAX_CONCURRENT_FETCHES = 6;

export const collectionDetails: Writable<Record<string, DatasetMetadata>> = writable({});

const labelCache = new Map<string, string>();
const inflightLabels = new Map<string, Promise<string>>();

let activeFetches = 0;
const fetchQueue: (() => void)[] = [];

const acquireFetchSlot = (): Promise<void> =>
	new Promise((resolve) => {
		if (activeFetches < MAX_CONCURRENT_FETCHES) {
			activeFetches++;
			resolve();
		} else {
			fetchQueue.push(resolve);
		}
	});

const releaseFetchSlot = (): void => {
	const next = fetchQueue.shift();
	if (next) {
		next();
	} else {
		activeFetches--;
	}
};

const limitedFetchText = async (url: string, signal?: AbortSignal): Promise<string | null> => {
	await acquireFetchSlot();
	try {
		const response = await fetch(url, { signal });
		return response.ok ? await response.text() : null;
	} finally {
		releaseFetchSlot();
	}
};

const nameFromUri = (uri: string): string => {
	const match = uri.match(/[?&](?:name|id)=([^&]+)/);
	return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : uri;
};

const resolveLabel = async (uri: string, signal?: AbortSignal): Promise<string> => {
	const cached = labelCache.get(uri);
	if (cached !== undefined) return cached;

	const existing = inflightLabels.get(uri);
	if (existing) return existing;

	const code = nameFromUri(uri);
	const resolution = (async () => {
		try {
			const text = await limitedFetchText(uri.replace(HOST, '/catalogue-api'), signal);
			if (text !== null) {
				const store = new Store(new Parser().parse(text));
				const labelColumn = `${uri.split('?')[0]}/column/label`;
				const fromColumn = store.getObjects(null, labelColumn, null).map((term) => term.value);
				const fromRdfs = store.getObjects(null, RDFS_LABEL, null).map((term) => term.value);
				const label =
					fromColumn[0] ??
					fromRdfs.find((value) => value !== code && !value.startsWith('http')) ??
					code;
				labelCache.set(uri, label);
				return label;
			}
		} catch {
			return code;
		}
		return code;
	})();

	inflightLabels.set(uri, resolution);
	try {
		return await resolution;
	} finally {
		inflightLabels.delete(uri);
	}
};

const parseCollection = async (
	turtle: string,
	id: string,
	signal?: AbortSignal
): Promise<DatasetMetadata | null> => {
	const store = new Store(new Parser().parse(turtle));

	const values = (field: string): string[] =>
		store.getObjects(null, COLUMN + field, null).map((term) => term.value);
	const first = (field: string): string | undefined => values(field)[0];
	const list = (field: string): string[] | undefined => {
		const result = values(field);
		return result.length ? result : undefined;
	};
	const num = (field: string): number | undefined => {
		const value = first(field)?.trim();
		if (!value) return undefined;
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : undefined;
	};
	const bool = (field: string): boolean | undefined => {
		const value = first(field);
		return value === undefined ? undefined : value === 'true';
	};
	const labelList = (field: string): Promise<string[] | undefined> => {
		const uris = values(field);
		return uris.length
			? Promise.all(uris.map((uri) => resolveLabel(uri, signal)))
			: Promise.resolve(undefined);
	};
	const labelFirst = (field: string): Promise<string | undefined> => {
		const uri = first(field);
		return uri === undefined ? Promise.resolve(undefined) : resolveLabel(uri, signal);
	};

	if (first('id') === undefined) return null;

	const yearRange = values('image_year_range');
	const start =
		yearRange.find((value) => value.startsWith('startDate'))?.replace('startDate:', '').trim() ||
		undefined;
	const end =
		yearRange.find((value) => value.startsWith('endDate'))?.replace('endDate:', '').trim() || undefined;

	const labels = {
		condition: labelFirst('condition'),
		topography: labelFirst('topography'),
		bodyParts: labelList('body_part_examined'),
		modalities: labelList('imaging_modality'),
		vendors: labelList('vendor'),
		sex: labelList('sex'),
		geographicCoverage: labelFirst('geographical_coverage'),
		datasetType: labelFirst('type'),
		interoperabilityTier: labelFirst('interoperability_tier'),
		collectionMethods: labelList('collection_method'),
		accessRights: labelList('image_access_type'),
		contactId: labelFirst('contact')
	};
	await Promise.all(Object.values(labels));

	return {
		id,
		title: first('name'),
		acronym: first('acronym'),
		description: list('description')?.join(' '),
		publisher: first('provider'),
		publisherType: first('publisherType'),
		contactId: await labels.contactId,
		numberOfSubjects: num('number_of_subjects'),
		numberOfStudies: num('number_of_studies'),
		numberOfSeries: num('number_of_series'),
		condition: await labels.condition,
		topography: await labels.topography,
		bodyParts: await labels.bodyParts,
		modalities: await labels.modalities,
		vendors: await labels.vendors,
		format: list('format'),
		imageYearRange: start || end ? { start, end } : undefined,
		imageSizeGB: num('image_size'),
		sex: await labels.sex,
		geographicCoverage: await labels.geographicCoverage,
		datasetType: await labels.datasetType,
		interoperabilityTier: await labels.interoperabilityTier,
		collectionMethods: await labels.collectionMethods,
		provenance: first('provenance'),
		intendedPurpose: list('intended_purpose'),
		commercialUse: bool('commercial_use'),
		accessRights: await labels.accessRights,
		accessConditions: list('image_access_description')?.join(' '),
		applicableLegislation: first('applicable_legislation'),
		legalBasis: first('legal_basis'),
		version: first('version'),
		withdrawn: bool('withdrawn'),
		issued: first('mg_insertedOn'),
		modified: first('mg_updatedOn')
	};
};

export const fetchCollection = async (
	id: string,
	signal?: AbortSignal
): Promise<DatasetMetadata | null> => {
	try {
		const turtle = await limitedFetchText(`${COLLECTIONS_URL}?id=${encodeURIComponent(id)}`, signal);
		return turtle === null ? null : await parseCollection(turtle, id, signal);
	} catch {
		return null;
	}
};
