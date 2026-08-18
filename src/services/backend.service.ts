import {
	getAst,
	clearSiteResults,
	markSiteClaimed,
	setSiteResult,
	removeFailedSite,
	type LensResult
} from '@samply/lens';
import { querySpot } from './spot';
import { fetchCollection, collectionDetails } from './collections.service';
// import testDatasetIds from './test-dataset-ids.json';
import { writable, type Writable } from 'svelte/store';
import type { Provider } from '../Types/types';

export const resultsStore: Writable<Provider[]> = writable([]);

// studies per collection = aggregated values of studies_count -> getAggregatedPopulationForStratumCode()
let abortController = new AbortController();
/**
 * This event listener is triggered when the user clicks the search button
 */
export const callBackend = async () => {
	console.log(
		'Search triggered, aborting previous request if any and starting a new one.'
	);
	abortController.abort();
	abortController = new AbortController();
	const { signal } = abortController;
	clearSiteResults();
	resultsStore.set([]); // The backend service maintains its own local resultStore that needs to be emptied
	collectionDetails.set({});

	/** Helper function to base64 encode a UTF-8 string */
	const base64Encode = (utf8String: string) =>
		btoa(String.fromCharCode(...new TextEncoder().encode(utf8String)));

	const query = base64Encode(
		JSON.stringify({
			lang: 'ast',
			query: base64Encode(JSON.stringify({ ast: getAst(), id: crypto.randomUUID() }))
		})
	);

	try {
		await querySpot(query, signal, (result) => {
			const site = result.from.split('.')[1];
			if (result.status === 'claimed') {
				markSiteClaimed(site);
			} else if (result.status === 'succeeded') {
				const siteResult: Provider = JSON.parse(atob(result.body));
				resultsStore.update((prev) => [...prev, siteResult]);
				const parsedResponse: LensResult = transformResponse(siteResult);
				setSiteResult(site, parsedResponse);

				siteResult.collections.forEach(async (collection) => {
					const details = await fetchCollection(collection.id, signal);
					if (details && !signal.aborted) {
						collectionDetails.update((prev) => ({ ...prev, [collection.id]: details }));
					}
				});
			} else {
				removeFailedSite(site);
				console.error(`Site ${site} failed with status ${result.status}:`, result.body);
			}
		});

		// testDatasetIds.forEach(async (dataset) => {
		// 	const details = await fetchCollection(dataset.id);
		// 	if (details) {
		// 		collectionDetails.update((prev) => ({ ...prev, [dataset.id]: details }));
		// 	}
		// });
	} catch (err) {
		console.error('Error calling querySpot:', err);
		// Error is already handled in querySpot with mock response
	}
};

export function transformResponse(provider: Provider): LensResult {
	const lensResult: LensResult = {
		stratifiers: {},
		totals: {}
	};

	// Calculate totals
	const totalSubjects = provider.collections.reduce(
		(acc, curr) => acc + curr.subjects_count,
		0
	);
	const totalStudies = provider.collections.reduce(
		(acc, curr) => acc + curr.studies_count,
		0
	);

	lensResult.totals['subjects'] = totalSubjects;
	lensResult.totals['studies'] = totalStudies;

	// iterate stratifiers for subjects, studies
	lensResult.stratifiers['subjects'] = {};
	lensResult.stratifiers['studies'] = {};

	provider.collections.forEach((collection) => {
		lensResult.stratifiers['subjects'][collection.name] = collection.subjects_count;
		lensResult.stratifiers['studies'][collection.name] = collection.studies_count;
	});

	return lensResult;
}
