<script lang="ts">
	import type { LensDataPasser } from '@samply/lens';

	export let options = {
		headerData: [],
		claimedText: ''
	};

	let response: Provider[] = [];

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

	let expanded: boolean[] = new Array(1).fill(false);
	let dataPasser: LensDataPasser;

	const toggleExpand = (index: string) => {
		expanded[index] = !expanded[index];
		const img: HTMLElement | null = document.getElementById(`expand-button-img-${index}`);
		if (!img) return;
		img.classList.toggle('expand-button-img-rotate');
	};

	const getResponse = (): void => {
		response = Array.from(
			dataPasser.getResponseAPI().values(),
			(x) => x.data.extension[0] as Provider
		);
	};

	/**
	 * watches the responseStore for changes to update the table
	 */
	/*
	let providers: Provider[] = [
		{
			provider: 'ProCancer1',
			provider_icon:
				'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAFoUlEQVRYhb1Xa2wUVRT+7r2zM9Pd7Wz3YbeVQlsohShUJYoIBgg+0IAKv4z+wESMUX9oMPCDGIWGRBJJMKgETSTEiGAkUWkimPAKJFZiEA2JD5paoZRKcF2alnZ37tyHP+5ueYhlNhBOMpkfc+893znnO9+5Q3CTbMWRbnt/998tRV/URqTkqbjds/3JtvNNqbgaax+5EaerO3usDw93LSn4fHlA6HzJmAutAd8HpILNyCnm8y9ro87m0+1Le24qgNqNB9oGhovbuJAz4HOAEoBZ5kQhgEAAPAB4ABJ1eZVrb7y/Ibnm0MsL+A0DSLyzb8lgke/USrmg1ETsc4AQwI6YRUUfKPhAEAARC6hyEbEjRyamqp86uWrhQPksWqnzmg37FgxKvUsDJt1CmicQgJCgIwVBAqEgJCAFoJQB4XMEgZjb89c/u2e+vdsun2dV4nzCpkOZvovFnVrDglKAVICUcCj622rdHUsnxb+b1xA/d4Er+/Nf8q0H/xBP9A/JxdCgEALwCQKl5p44y9sBrAYqLIGztmOTT9mrUMrUWQjcZtODH8xJr5uSrTnneV7OcZwiIQScc3toaCi15tuTc3d35d+VIB4cG1AKhDExLu5M6Vv/dE/oDNy1Ya93Ij/8AhgDKAUCgQRRx3c+Mu6NSQ313ZlMJl9dXX1Fyw0PDw+890zyfGH70eLenoFPEQgKraEBK18MXuOcrwjNgT9zQ49pn0cxNGzqTQmWTU2snzxhXFd9ff1/nANALBZT2Wz24tZlszvSUfsLaFXihEDAxZILg0M0NICABw9ASNNuBPC86M8v3Tf+eCaTGXBd93/FJhKJqHQ6PTIuHd8K1wUsk/RAqgmv7PpxQmgAigcNJnIKUArPor8mEolcLBYbU+kAwHEc9eys5qOEMQWLmbakFL0XChNDA9BaR0EJoLVJI5CPRqPFsPsfbs4WKefC7NcAo7Ap3PBtKCXAGOAHgJCQllaWZV03+rIt2/59nVTahuuYMlKC21PRixXogAa4MG9KgZHwOwHgdIDFiFUBjg0QAqoUf/Ge2t7QJSCUUmhlSiAlEMjQzqdtPhwtuu4qRCLl8sGj+lhzMjYSXoqVHiWgecJp2KItB+zus7ltUumJIDAApMT0pP1VNFpJCSgBNMzACamfTSs/m7rvxOkt3LbngzHDIakQg+7aMK9hT3V1dZFkV++6e1iqxeZgYqIbHDJiQwjAKACCgpTLpdJN5iCKKugfIkp/owAFrUAACpguUdBJAXIvl2q2ZozCjgDxKMAYiO/z51viy99aOG1PY2Nj3hoMxIyCxjroEsm0USpoDRMyAEINGK0AiwGEoCDlzAIwE7LEi8sfwKyzGMqg4HMQSsVD9e6br89p6kwmkwMAYFGfGz+UmrGpdclZ+Q3Ati6Rr+gbNYtY5jsuA01LQIFLe0UASAmL0fyi8VXt7fMb92ez2T7P8xQAWCQQhmCEGAeEjDIVukQ8VdJwpS8V2GIGiMXMZESJYIxeCkApUMaK4xNOx8pZ2U/mT67rqqur681kMqO3IsuxrXMWQSdRikKWHOgS0ShFmTyDkt0hAQ88AJSCw2h/1GG9IBFASQBVo6AjRI/ERXC+sdr67bm2TOeddV4ulUr1ZzKZfCKREJcTleRyOffMmTMtQRDYGMMe/frUpoGR4MHyFWtSjfvxjsfHv18oFHJXryWEKMYYHMcRNTU1PJ1OFz3PE9dSTsvzPN7S0vK71vrqb1dYgfZdhINRchWoNdLa2tqVTCZDz4NrmWXbtgJw/Ym2tsNcwUqtqgkBY0xcb991AYReSYhpR2GGEUh4KR7LwksxMROsrAOjnXKDFj4DoiROlJldtzwDvCRStCTXrOJfimtaZReSsuwGAojcFP8VZKAcMS+R8FZzYHrS/SjK9DFo80fUXFP1080A8C9aFIsvIvNvZAAAAABJRU5ErkJggg==',
			collections: [
				{
					name: 'Collection1',
					id: '02865f6d-15b1-4775-ab15-7bc7d95700a9',
					studies_count: 320,
					subjects_count: 322,
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

	let providers2: Provider[] = [
		{
			provider: 'ProCancerI',
			provider_icon:
				'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',
			collections: [
				{
					name: 'ProCAncer-I Use Case 1',
					id: 'ea3649c3524b0886fad16472354ee9f6',
					description:
						'This dataset contains a collection of patients with no PCa confirmed at pathology (or patients with no PCa findings on MRI and confirmed negative at follow-up (at least 1 year)) and collection of patients with confirmed PCa at biopsy and/or prostatectomy.',
					subjects_count: 8826,
					studies_count: 8848,
					age_range: {
						min: 0,
						max: 91
					},
					modalities: ['MR', 'SC'],
					body_parts: ['Prostate'],
					gender: ['Male']
				},
				{
					name: 'ProCAncer-I Use Case 2',
					id: '321e707a9c82cab4721c80e7aa30f2f8',
					description:
						'This dataset contains a collection of patients with confirmed PCa at biopsy and/or prostatectomy.',
					subjects_count: 5432,
					studies_count: 5434,
					age_range: {
						min: 0,
						max: 91
					},
					modalities: ['MR', 'SC'],
					body_parts: ['Prostate'],
					gender: ['Male']
				}
			]
		},
		{
			provider: 'CHAIMELEON',
			provider_icon:
				'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',
			collections: [
				{
					id: '97c6494a-e42c-47d6-83f7-76cda5865350',
					name: 'Prostate Cancer Training/Validation dataset (October 2024)',
					studies_count: 1149,
					subjects_count: 1149,
					age_range: {
						min: 46,
						max: 965
					},
					gender: ['Male'],
					modality: ['MR', 'CT', 'DX', 'Unknown'],
					body_parts: [
						'PROSTATE',
						'ARM',
						'PELVIS',
						'ABDOMEN',
						'Pelvis^Masculin',
						'HEAD',
						'ABDOMENPELVIS',
						'PANCREAS',
						'BRAIN',
						'SKULL',
						'CHESTABDPELVIS',
						'CERVIX',
						'KNEE',
						'HIP',
						'NECK',
						'Unknown'
					],
					description:
						'Prostate cancer patient cases (diagnosis images and clinical data) for the training and validation of AI models'
				},
				{
					id: '846a5512-8dfc-4bbd-afe7-fd16bf7b44f0',
					name: 'Prostate Cancer Test dataset (October 2024)',
					studies_count: 288,
					subjects_count: 288,
					age_range: {
						min: 48,
						max: 86
					},
					gender: ['Male'],
					modality: ['MR', 'DX'],
					body_parts: [
						'PROSTATE',
						'ARM',
						'PELVIS',
						'ABDOMEN',
						'SKULL',
						'Pelvis^Masculin',
						'HEAD',
						'PANCREAS',
						'LUMBAR SPINE',
						'Unknown'
					],
					description:
						'Prostate cancer patient cases (diagnosis images and clinical data) for the testing of AI models'
				},
				{
					id: '4a97e985-ecdb-4ed2-9ed9-a8917dc6ceb8',
					name: 'Colon Cancer Training/Validation dataset (October 2024)',
					studies_count: 904,
					subjects_count: 904,
					age_range: {
						min: 28,
						max: 97
					},
					gender: ['Male', 'Female'],
					modality: ['CT', 'DX', 'PT'],
					body_parts: [
						'ABDOMEN',
						'CHEST',
						'COLOSCANNER',
						'TAP',
						'BRAIN',
						'NECK',
						'LUNG',
						'COLOSCANNER EAU',
						'SPINE',
						'WHOLEBODY',
						'TORAX',
						'TXABDPELVIS',
						'ABDOMEN / PELVIS',
						'ABDOPELV',
						'CRANE COLO',
						'THORAX',
						'TC ABD_MINO_P_LV',
						'EXTREMITY',
						'AORTA',
						'TXABDOMENPELVIS',
						'CTAP',
						'UROSCANNER',
						'CAP',
						'Unknown'
					],
					description:
						'Colon cancer patient cases (diagnosis images and clinical data) for the training and validation of AI models'
				},
				{
					id: 'bf5c8177-a9ba-4077-8400-e0c15f91efd3',
					name: 'Colon Cancer Test dataset (October 2024)',
					studies_count: 217,
					subjects_count: 217,
					age_range: {
						min: 36,
						max: 93
					},
					gender: ['Male', 'Female'],
					modality: ['CT', 'PT'],
					body_parts: [
						'ABDOMEN',
						'CHEST',
						'COLOSCANNER',
						'TAP',
						'SPINE',
						'BRAIN',
						'NECK',
						'TXABDOMENPELVIS',
						'LUNG',
						'THORAX / ABDOMEN',
						'Unknown'
					],
					description:
						'Colon cancer patient cases (diagnosis images and clinical data) for the testing of AI models'
				},
				{
					id: '2d87741d-77ba-45da-bdc1-71edc82ac557',
					name: 'Colon Cancer (April 2024)',
					studies_count: 838,
					subjects_count: 775,
					age_range: {
						min: 33,
						max: 95
					},
					gender: ['Male', 'Female', 'Unkown'],
					modality: ['CT', 'CR', 'DX'],
					body_parts: [
						'ABDOMEN',
						'CHEST',
						'COLOSCANNER',
						'BRAIN',
						'NECK',
						'LUNG',
						'WHOLEBODY',
						'TAP',
						'TORAX',
						'COLOSCANNER EAU',
						'THORAX',
						'EXTREMITY',
						'AORTA',
						'UROSCANNER',
						'THORAX / ABDOMEN',
						'CAP',
						'Unknown'
					],
					description:
						'All Patient Cases (images and clinical data) collected until 24/04/2024 in the CHAIMELEON Repository related to Colon cancer.'
				},
				{
					id: 'fa55afe4-7bb5-4531-9211-c51a4df6b2c8',
					name: 'Rectum Cancer (April 2024)',
					studies_count: 537,
					subjects_count: 360,
					age_range: {
						min: 28,
						max: 89
					},
					gender: ['Male', 'Female'],
					modality: ['MR'],
					body_parts: [
						'RECTUM',
						'ABDOMEN',
						'PELVIS',
						'PROSTATE',
						'BLADDER',
						'ARM',
						'ABDOMENPELVIS',
						'PANCREAS',
						'CANALANAL',
						'UTERUS',
						'PELVISLOWEREXTR',
						'PENIS',
						'Unknown'
					],
					description:
						'All Patient Cases (images and clinical data) collected until 24/04/2024 in the CHAIMELEON Repository related to Rectum cancer.'
				},
				{
					id: '73736488-69a9-4c8c-a995-64e9cad376dd',
					name: 'OpenChallenge Championship Training Dataset for Rectum Cancer',
					studies_count: 231,
					subjects_count: 231,
					age_range: {
						min: 29,
						max: 89
					},
					gender: ['Male', 'Female'],
					modality: ['MR', 'Unknown'],
					body_parts: ['RECTUM', 'ABDOMEN', 'PELVIS', 'Unknown'],
					description:
						'This dataset was prepared for the participants in the second championship phase of the Open challenge organized by the CHAIMELEON project for the training of AI models to answer a specific clinical question to improve diagnostic efficacy in rectal cancer patients. The main objective was, therefore, to <strong>predict Extramural Vascular Invasion (EVI) and Mesorectal Fascia Invasion (MFI) in MRI</strong>.<br>\n<br>\nAll 347 rectum cases (images and clinical data) collected until November 2023 were initially taken. Then 12 cases were excluded due to missing baseline MRI and other 4 cases due to missing axial and sagittal MRI series. <br>\n<br>                                                    \nFrom the 331 resulting cases, 231 were selected for the training partition and so included in this dataset: \n<ul>\n <li><strong>71 with EVI, 159 with no EVI</strong></li>\n <li><strong>55 with MFI, 176 with no MFI</strong></li>\n</ul>\nThe original series (DICOM) with transversal and sagittal T2w images were selected, and an extra series was added with harmonized images in NIfTI format. <br>\nOnly the imaging exam at diagnosis was included.<br>\n<br>\nIn the Open Challenge only demographic and diagnosis information (excl. imaging report and biopsy-related information) was shared with the participants to avoid introducing biases during model training. However, in this dataset, the complete clinical data is included in the eforms.json file to allow researchers further experimentation on different clinical endpoints.<br>\nThe ground truth used during the Open Challenge can be found in the following variables: \n<ul>\n <li>mesorectal_invasion_mr </li>\n <li>extramural_invasion_mr </li>\n</ul>\n<br>'
				},
				{
					id: 'f90ab277-9f66-448e-a996-f55a7866580b',
					name: 'OpenChallenge Championship Training Dataset for Colon Cancer',
					studies_count: 408,
					subjects_count: 408,
					age_range: {
						min: 40,
						max: 94
					},
					gender: ['Male', 'Female'],
					modality: ['CT'],
					body_parts: [
						'ABDOMEN',
						'CHEST',
						'BRAIN',
						'NECK',
						'LUNG',
						'WHOLEBODY',
						'EXTREMITY',
						'AORTA',
						'TORAX',
						'CAP',
						'Unknown'
					],
					description:
						"This dataset was prepared for the participants in the second championship phase of the Open Challenge organized by the CHAIMELEON project for the training of AI models to resolve a specific clinical question related to Colon cancer: <br>\n<strong>predict patient's TNM</strong>.<br>\n<br>\nAll 679 colon cases (images and clinical data) collected until November 2023 were initially taken. Then 47 cases were excluded due to missing TNM information, 3 due to T0 cases and other 61 cases due to missing baseline CT. <br>\n<br>\nFrom the 568 resulting cases, 408 were selected for the training partition and so included in this dataset:\n<ul>\n <li><strong>64 T1/T2, 218 T3, 78 T4a, 23 T4b</strong></li>\n <li><strong>255 N0, 94 N1, 54 N2</strong></li>\n <li><strong>364 M0, 39 M1</strong></li>\n</ul>\nAll the original series (DICOM) collected are included. <br>\nOnly images from diagnosis.<br>\n<br>\nIn the Open Challenge only demographic and diagnosis information (excl. clinical TNM and biopsy-related information) was shared with the participants, but here the complete clinical data is included in the eforms.json file.<br>\nThe ground truth for the clinical question in that case (TNM) is in those variables:\n<ul>\n <li>tumor_pathology_category (T)</li>\n <li>regional_nodes_pathological_category (N)</li>\n <li>metastasis_pathological_category (M)</li>\n</ul>\n<br>"
				},
				{
					id: 'b875a59a-32f0-4e47-9da6-1e635a85b370',
					name: 'OpenChallenge Championship Training Dataset for Prostate Cancer',
					studies_count: 446,
					subjects_count: 446,
					age_range: {
						min: 46,
						max: 86
					},
					gender: ['Male'],
					modality: ['MR', 'Unknown'],
					body_parts: [
						'PROSTATE',
						'ARM',
						'PELVIS',
						'Pelvis^Masculin',
						'ABDOMEN',
						'Unknown'
					],
					description:
						"This dataset was prepared for the participants in the second championship phase of the Open Challenge organized by the CHAIMELEON project for the training of AI models to resolve a specific clinical question related to Prostate cancer: <br>\n<strong>Low vs. High risk patients prediction</strong> (in order to avoid unnecessary aggressive procedures in low-grade patients and to provide the most advanced therapy for high-grade). <br>\n<br>\nAll 669 prostate cases (images and clinical data) collected until November 2023 were initially taken. Then 12 cases were excluded due to missing Gleason information, 13 cases due to missing baseline MRI and other 8 cases due to missing axial T2w MRI. <br>\n<br>\nFrom the 636 resulting cases, 446 were selected for the training partition and so included in this dataset: <br>\n<strong>324 with low risk</strong> and <strong>122 with high risk</strong>. <br>\n<br>\nThe original series (DICOM) with T2w and DWI images were selected and an extra series was added with harmonized T2w images in NIfTI format. <br>\nOnly images from diagnosis were included in the dataset.<br>\n<br>\nIn the Open Challenge only demographic and diagnosis information (excl. PIRADS score and biopsy-related information) was shared with the participants, but here the complete clinical data is included in the eforms.json file.<br>\nThe ground truth for the clinical question in that case was based in the Gleason score variables. Those patient with a 3+4 Gleason score or below were considered <strong>low risk</strong> patients while, those with a Gleason of 4+3 or above where considered <strong>high risk</strong> ones.<br>\n<pre>\n    diagnosis_data = case['eForm']['pages'][2]['page_data']\n\n    gleason_primary = int(diagnosis_data['primary_gleason_pattern']['value'][-1])\n    gleason_secondary = int(diagnosis_data['secondary_gleason_pattern']['value'][-1])\n    gleason_sum = gleason_primary + gleason_secondary\n\n    if gleason_sum < 7: risk = 'Low'\n    elif gleason_sum > 7: risk = 'High'\n    elif gleason_primary == 3 and gleason_secondary == 4: risk = 'Low'\n    elif gleason_primary == 4 and gleason_secondary == 3: risk = 'High'\n</pre>\n<br>"
				},
				{
					id: 'b66781db-8b21-4a30-ac0d-8eaa2a4c0ecc',
					name: 'OpenChallenge Championship Training Dataset for Breast Cancer',
					studies_count: 411,
					subjects_count: 411,
					age_range: {
						min: 27,
						max: 97
					},
					gender: ['Female'],
					modality: ['MG', 'Unknown'],
					body_parts: ['BREAST'],
					description:
						'This dataset was prepared for the participants in the second championship phase of the Open challenge organized by the CHAIMELEON project for the training of AI models to resolve a specific clinical question related to Breast cancer: <br>\n<strong>predict histology subtype (Ductal Carcinoma In Situ - DCIS, Invasive Ductal Carcinoma - IDC, Invasive Lobular Carcinoma - ILC, or Other)</strong>. <br>\n<br>\nAll 631 breast cases (images and clinical data) collected until November 2023 were initially taken. Then 22 cases were excluded due to missing diagnosis MG study and 21 due to unknown histology type. <br>\n<br>\nFrom the 588 resulting cases, 411 were selected for the training partition and so included in this dataset: <br>\n<strong>41 with DCIS</strong>, <strong>302 with IDC</strong>, <strong>46 with ILC</strong> and <strong>22 with Other histology subtype</strong><br>\n<br>\nOnly studies of Mammographies were selected.<br>\nAll the original series (DICOM) are included. <br>\nOnly images from diagnosis.<br>\n<br>\nIn the Open Challenge only demographic and diagnosis information (excl. biopsy-related information) was shared with the participants, but here the complete clinical data is included in the eforms.json file.<br>\nThe ground truth for the clinical question in that case is in the variable: <br>\nbiopsy_tumor_histotype<br>\n<br>'
				},
				{
					id: '5e8a4b13-8c92-40dd-9d4c-04124440f43a',
					name: 'OpenChallenge Championship Training Dataset for Lung Cancer',
					studies_count: 559,
					subjects_count: 559,
					age_range: {
						min: 33,
						max: 91
					},
					gender: ['Male', 'Female'],
					modality: ['CT', 'Unknown'],
					body_parts: [
						'CHEST',
						'ABDOMEN',
						'LUNG',
						'THORAX / ABDOMEN',
						'THORAX INJECTE',
						'THORAX',
						'SPINE',
						'TAP',
						'WHOLEBODY',
						'HEART',
						'TOTAL BODY',
						'TAP IV',
						'TORAX',
						'CTAP',
						'TC TOTAL BODY',
						'Unknown'
					],
					description:
						'This dataset was prepared for the participants in the second championship phase of the Open challenge organized by the CHAIMELEON project for the training of AI models to resolve a specific clinical question related to Lung cancer: <br>\n<strong>predict overall survival</strong>. <br>\n<br>\nAll 903 lung cases (images and clinical data) collected until November 2023 were initially taken. Then 3 cases were excluded due to missing death of follow-up information, 11 due to missing CT with the whole thoracic area, and 89 due to missing baseline CT scan. <br>\n<br>\nFrom the 800 resulting cases, 559 were selected for the training partition and so included in this dataset: <br>\n<strong>297 event</strong> and <strong>262 censored</strong> <br>\n<br>\nThe original series (DICOM) with CT scans covering the whole thoracic area were selected, and an extra series was added with harmonized images in NIfTI format. <br>\nOnly images from diagnosis were included in the dataset.<br>\n<br>\nThe complete clinical data is included in the eforms.json file.<br>\nThe ground truth for the clinical question in that case was the overall survival, calculated as the time elapsed from diagnosis to death or last follow-up. This time can be calculated using the variables: \n<ul>\n <li>"baseline_date": Diagnosis date</li>\n <li>"death_date": Death date, if applicable</li>\n <li>"last_contact_date": Last follow-up date</li>\n</ul>\n<br>'
				},
				{
					id: '630ee013-a7b8-4e01-823b-81918543d3f6',
					name: 'Breast Cancer (April 2024)',
					studies_count: 1507,
					subjects_count: 1238,
					age_range: {
						min: 27,
						max: 97
					},
					gender: ['Female', 'Male', 'Unkown'],
					modality: ['MG', 'MR', 'CT', 'CR', 'Unknown'],
					body_parts: ['BREAST', 'HEAD', 'ABDOMEN', 'CHEST', 'MAMOGRAFIA', 'Unknown'],
					description:
						'All Patient Cases (images and clinical data) collected until 23/04/2024 in the CHAIMELEON Repository related to Breast cancer.'
				},
				{
					id: '05674e3a-596e-40e8-97a5-21846fef19a3',
					name: 'Prostate Cancer (April 2024)',
					studies_count: 991,
					subjects_count: 909,
					age_range: {
						min: 46,
						max: 965
					},
					gender: ['Male', 'Unkown'],
					modality: ['MR', 'CT', 'PT', 'Unknown'],
					body_parts: [
						'PROSTATE',
						'PELVIS',
						'ARM',
						'ABDOMEN',
						'Pelvis^Masculin',
						'HEAD',
						'PANCREAS',
						'CHESTABDPELVIS',
						'ABDOMENPELVIS',
						'LUMBAR SPINE',
						'Unknown'
					],
					description:
						'All Patient Cases (images and clinical data) collected until 23/04/2024 in the CHAIMELEON Repository related to Prostate cancer.'
				},
				{
					id: '822ad0bd-02d1-4932-a8b2-7d5679c3d4f0',
					name: 'Lung Cancer (April 2024)',
					studies_count: 3140,
					subjects_count: 1254,
					age_range: {
						min: 29,
						max: 91
					},
					gender: ['Male', 'Female', 'Unkown'],
					modality: ['CT', 'PT', 'DX', 'CR'],
					body_parts: [
						'CHEST',
						'ABDOMEN',
						'SPINE',
						'NECK',
						'BRAIN',
						'HEAD',
						'LUNG',
						'WHOLEBODY',
						'THORAX',
						'THORAX / ABDOMEN',
						'THORAX INJECTE',
						'TAP',
						'SERVICE',
						'EXTREMITY',
						'CRANE',
						'LSPINE',
						'CSPINE',
						'TAP IV',
						'TORAX',
						'UNKNOWN',
						'COU THORAX',
						'HEART',
						'TC TOTAL BODY',
						'TOTAL BODY',
						'ABDO PELVIS',
						'ABDOPELV',
						'PORT SHOULDER',
						'TDM ABDOMEN / PE',
						'SINUS CTAP',
						'CTAP',
						'RACHIS',
						'TDM THORAX / ABD',
						'THORAX IV',
						'TB COLLO',
						'Unknown'
					],
					description:
						'All Patient Cases (images and clinical data) collected until 23/04/2024 in the CHAIMELEON Repository related to Lung cancer.'
				}
			]
		}
	];
*/
	//response = providers2;
	/*
	const blacklist = ['id', 'studies_count', 'subjects_count'];
	providers.forEach((provider) => {
		provider.collections.forEach((collection) => {
			var resultArray = Object.keys(collection).map(function (index) {
				console.log(index)
				console.log(collection[index])
				if (!blacklist.includes(index)) return "";
			});
		})
	})*/
	console.log('testresponse');
	console.log(response);
	//response2 = response.get('ProCancer1')
	/*if (response) {
		response2 = Array.from(response, ([provider, collections]) => ({
			provider: provider,
			collections: collections.data.extension
		} as Provider));
	}*/
</script>

<button on:click="{getResponse}"> getResponse </button>
<span>{response}</span>
<table cellspacing="0" class="result-table">
	<thead class="table-header">
		<tr class="table-header-row">
			{#each options.headerData as header}
				<th class="table-header-cell table-header-datatype">
					{header.title}
				</th>
			{/each}
			<th class="expand-header"></th>
		</tr>
	</thead>
	<tbody class="table-body">
		{#each response as provider, index1}
			{#each provider.collections as tableRow, index2}
				<tr
					class="table-row"
					class:expanded-row="{expanded[index1.toString() + index2.toString()]}"
				>
					<td class="table-cell table-cell-name" style="width:30%">{tableRow.name}</td>
					<td class="table-cell" style="width:30%">
						{#if provider.provider_icon}
							<img
								src="data:image/png;base64, {provider.provider_icon}"
								alt=""
								class="provider-icon"
							/>
						{/if}
						{provider.provider}</td
					>
					<td class="table-cell" style="width:18%">{tableRow.studies_count}</td>
					<td class="table-cell" style="width:18%">{tableRow.subjects_count}</td>
					<td class="table-cell" style="width:4%">
						<button
							class="expand-button"
							on:click="{() => toggleExpand(index1.toString() + index2.toString())}"
							><img
								class="expand-button-img expand-button-img-rotate"
								id="expand-button-img-{index1.toString() + index2.toString()}"
								src="right-arrow-svgrepo-com.svg"
								alt="toggle additional information icon"
							/></button
						>
					</td>
				</tr>
				{#if expanded[index1.toString() + index2.toString()]}
					<tr class="table-row">
						<td class="table-cell-hidden" colspan="5">
							<div class="table-cell-hidden-data-wrapper">
								<table class="collection-table">
									<tr class="table-row">
										<td class="collection-name">Age range: </td><td
											class="collection-value"
											>{tableRow.age_range.min} to {tableRow.age_range.max}</td
										>
									</tr>
									<tr class="table-row">
										<td class="collection-name">Gender: </td><td class="collection-value"
											>{tableRow.gender.join(', ')}</td
										>
									</tr>
									<tr class="table-row">
										{#if tableRow.modality}
											<td class="collection-name">Modality: </td><td
												class="collection-value">{tableRow.modality.join(', ')}</td
											>
										{/if}
										{#if tableRow.modalities}
											<td class="collection-name">Modality: </td><td
												class="collection-value">{tableRow.modalities.join(', ')}</td
											>
										{/if}
									</tr>
									<tr class="table-row">
										<td class="collection-name">Body parts: </td><td
											class="collection-value">{tableRow.body_parts.join(', ')}</td
										>
									</tr>
									<tr class="table-row">
										<td class="collection-name">Description: </td><td
											class="collection-value">{tableRow.description}</td
										>
									</tr>
								</table>
							</div>
						</td>
					</tr>
				{/if}
			{/each}
		{/each}
	</tbody>
</table>
<lens-data-passer bind:this="{dataPasser}"></lens-data-passer>

<style>
	.table-cell,
	th {
		text-align: left;
		padding: 0.5em 0 0.5em 10px;
	}
	.table-cell-name {
		color: var(--orange);
	}
	.table-cell-hidden {
		border-bottom: solid var(--gray) 1px;
	}
	.table-cell-hidden-data-wrapper {
		margin: 10px 0 20px 30px;
		padding: 0px 10px;
	}
	.expand-button {
		background-color: transparent;
		border: none;
		cursor: pointer;
	}
	.expand-button-img {
		width: 20px;
		height: 20px;
		rotate: -90deg;
		transition: all 0.3s;
	}
	.expand-button-img-rotate {
		rotate: 90deg;
	}
	.provider-icon {
		width: 16px;
		height: 16px;
	}
	.collection-table > tr > td {
		text-align: left;
		padding-top: 0.5em;
		padding-bottom: 0.5em;
	}
	.collection-name {
		width: 30%;
	}
	.expanded-row {
		font-weight: bold;
	}
</style>
