import type { AstTopLayer, Site } from '@samply/lens';
import {Spot} from "./spot";


// studies per collection = aggregated values of studies_count -> getAggregatedPopulationForStratumCode()

export const requestBackend = (
	ast: AstTopLayer,
	updateResponse: (response: Map<string, Site>) => void,
	abortController: AbortController
) => {
	console.log('entered backendCall');
	//console.log('response', response);
	console.log(abortController);

	const queryId = crypto.randomUUID();
	const query = {
		lang: 'ast',
		query: btoa(
			decodeURI(
				JSON.stringify({ ast: ast, id: queryId.concat('__search__').concat(queryId) })
			)
		)
	};


	let backendUrl: string = '';
	/**
	 * TODO: add different backend URLs for different environments
	 */

	// if (import.meta.env.VITE_TARGET_ENVIRONMENT === "production") {
	//     backendUrl = "https://locator-dev.bbmri-eric.eu/backend";
	// } else if (import.meta.env.VITE_TARGET_ENVIRONMENT === "staging") {
	//backendUrl = 'https://locator-dev.bbmri-eric.eu/backend/';
	// } else {
	     backendUrl = "http://localhost:8055";
	// }


	const backend = new Spot(
		new URL(backendUrl),
		['uppsala-test', 'eric-test', 'prague-uhkt-test'],
		queryId
	);

	backend.send(btoa(decodeURI(JSON.stringify(query))), updateResponse, abortController);

	/***************************************************************************************************************/

	// try {
	//     const response = await fetch('/api', {
	//         method: 'POST',
	//         headers: {
	//             'Content-Type': 'application/json',
	//         },
	//         body: JSON.stringify(ast),
	//         signal: abortController.signal
	//     });
	//     if (response.ok) {
	//         const data = await response.text();
	//         console.log(data);
	//         // updateResponse(data);
	//     } else {
	//         console.error('Server response was not ok.');
	//     }
	// } catch (error) {
	//     console.error('Error:', error);
	// }

};
