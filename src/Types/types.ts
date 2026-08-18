export type Provider = {
	provider: string;
	provider_icon?: string;
	collections: CollectionItem[];
};

type CollectionItem = {
	name: string;
	id: string;
	provider_icon?: string;
	provider?: string;
	studies_count: number;
	subjects_count: number;
	age_range: {
		min: number;
		max: number;
	};
	gender: string[];
	modality?: string[];
	modalities?: string[];
	body_parts: string[];
	description: string;
};

export type DatasetMetadata = {
	id: string;
	title?: string;
	acronym?: string;
	description?: string;
	publisher?: string;
	publisherType?: string;
	contactId?: string;
	numberOfSubjects?: number;
	numberOfStudies?: number;
	numberOfSeries?: number;
	condition?: string;
	topography?: string;
	bodyParts?: string[];
	modalities?: string[];
	vendors?: string[];
	format?: string[];
	imageYearRange?: { start?: string; end?: string };
	imageSizeGB?: number;
	sex?: string[];
	geographicCoverage?: string;
	datasetType?: string;
	interoperabilityTier?: string;
	collectionMethods?: string[];
	provenance?: string;
	intendedPurpose?: string[];
	commercialUse?: boolean;
	accessRights?: string[];
	accessConditions?: string;
	applicableLegislation?: string;
	legalBasis?: string;
	version?: string;
	withdrawn?: boolean;
	issued?: string;
	modified?: string;
};
