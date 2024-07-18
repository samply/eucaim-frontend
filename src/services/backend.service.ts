import type { AstTopLayer, ResponseStore, Site } from "@samply/lens";

export type SiteData = {
    // date: string;
    // extension: object[];
    group: { // measure[s]
        code: {
            text: string;
        };
        population: {
            count: number;
            // code: {
            //     coding: {
            //         system: string;
            //         code: string;
            //     }[];
            // };
        }[];
        stratifier: {
            code: {
                text: string;
            }[];
            stratum: {
                population: {
                    count: number;
                    // code: {
                    //     coding: {
                    //         code: string;
                    //         system: string;
                    //     }[];
                    // };
                }[];
                value: {
                    text: string;
                };
            }[];
        }[];
    }[];
    measure: string;
    period: object;
    resourceType: string;
    status: string;
    type: string;
};

// studies per collection = aggregated values of studies_count -> getAggregatedPopulationForStratumCode()
const response = [
    {
        provider: 'ProCancer1', // standort
        // provider_icon: 'provider-icon.svg',
        collections: [ //groups //measure -> measure population = number of collection items
            {
                name: 'Collection1', // group 0 code -> UC1 // male in diagram
                id: '02865f6d-15b1-4775-ab15-7bc7d95700a9',
                studies_count: 320, //stratum -> studies per collection -> number shown in diagram
                subjects_count: 322, // stratum
                age_range: {
                    min: 40,
                    max: 70
                },
                gender: ['Male', 'Unknown'],
                modality: ['MRI', 'PET-CT'],
                body_parts: ['Rectum', 'Prostate', 'Pelvis'],
                description: 'Example Collection 1 from ProCancer1'
            },
            {
                name: 'Collection2',
                id: 'b0e24524-0dc7-4de1-b058-8b27aff39f27',
                studies_count: 15,
                subjects_count: 24,
                age_range: {
                    min: 20,
                    max: 40
                },
                gender: ['Male'],
                modality: ['MRI'],
                body_parts: ['Rectum', 'Prostate', 'Pelvis'],
                description: 'Example Collection 2 from ProCancer1'
            },
            {
                name: 'Collection3',
                id: '578a6d9f-3f4d-4670-9245-cb44a7716932',
                studies_count: 10,
                subjects_count: 4322,
                age_range: {
                    min: 20,
                    max: 70
                },
                gender: ['Female'],
                modality: ['MRI'],
                body_parts: ['Breast', 'Lung'],
                description: 'Example Collection 3 from ProCancer1'
            },
            {
                name: 'Collection4',
                id: '7c0a05b9-80a7-4122-8836-d75ce16f4be3',
                studies_count: 5,
                subjects_count: 7,
                age_range: {
                    min: 10,
                    max: 20
                },
                gender: ['Male', 'Female'],
                modality: ['PET'],
                body_parts: ['Colon'],
                description: 'Example Collection 4 from ProCancer1'
            }
        ]
    }
];

export const backendCall = (ast: AstTopLayer, updateResponse: (response: Map<string, Site>) => void, abortController: AbortController) => {
    console.log('entered backendCall');
    console.log('response', response);
    console.log(abortController);

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

    const transformedResponse: ResponseStore = new Map();

    response.forEach((provider) => {
        console.log(provider);
        const providerData: Site = {
            status: 'succeeded',
            data: {
                group: provider.collections.map((collection) => (
                    { // group item
                        code: {
                            text: collection.name
                        },
                        population: [
                            {
                                count: provider.collections.reduce((acc, curr) => acc + curr.studies_count, 0),
                            }
                        ],
                        stratifier: [
                            //studies stratifier
                            {
                                code: [{text: 'Studies'}],
                                stratum: [
                                    {
                                        value: {text: 'studies_count'},
                                        population: [{count: collection.studies_count}],
                                    }
                                ]

                            },


                            
                            // subjects stratifier
                        ]
                    }
                ))
            }
        }
        transformedResponse.set(provider.provider, providerData);
    });

    console.log(transformedResponse);
    updateResponse(transformedResponse);
    // updateResponse(transformedResponse);

    // return response
}
