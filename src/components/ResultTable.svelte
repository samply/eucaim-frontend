<script lang="ts">
	export let options = {
		headerData: [],
		claimedText: ''
	};

    export let response: Provider[] = [];

	type Provider = {
		provider: string;
		provider_icon: string;
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
		modality: string[];
		body_parts: string[];
		description: string;
	};

	// let providers: Provider[] = [
	// 	{
	// 		provider: 'ProCancer1',
	// 		provider_icon: 'provider-icon.svg',
	// 		collections: [
	// 			{
	// 				name: 'Collection1',
	// 				id: '02865f6d-15b1-4775-ab15-7bc7d95700a9',
	// 				studies_count: 320,
	// 				subjects_count: 322,
	// 				age_range: {
	// 					min: 40,
	// 					max: 70
	// 				},
	// 				gender: ['Male', 'Unknown'],
	// 				modality: ['MRI', 'PET-CT'],
	// 				body_parts: ['Rectum', 'Prostate', 'Pelvis'],
	// 				description: 'Example Collection 1 from ProCancer1'
	// 			},
	// 			{
	// 				name: 'Collection2',
	// 				id: 'b0e24524-0dc7-4de1-b058-8b27aff39f27',
	// 				studies_count: 15,
	// 				subjects_count: 24,
	// 				age_range: {
	// 					min: 20,
	// 					max: 40
	// 				},
	// 				gender: ['Male'],
	// 				modality: ['MRI'],
	// 				body_parts: ['Rectum', 'Prostate', 'Pelvis'],
	// 				description: 'Example Collection 2 from ProCancer1'
	// 			},
	// 			{
	// 				name: 'Collection3',
	// 				id: '578a6d9f-3f4d-4670-9245-cb44a7716932',
	// 				studies_count: 10,
	// 				subjects_count: 4322,
	// 				age_range: {
	// 					min: 20,
	// 					max: 70
	// 				},
	// 				gender: ['Female'],
	// 				modality: ['MRI'],
	// 				body_parts: ['Breast', 'Lung'],
	// 				description: 'Example Collection 3 from ProCancer1'
	// 			},
	// 			{
	// 				name: 'Collection4',
	// 				id: '7c0a05b9-80a7-4122-8836-d75ce16f4be3',
	// 				studies_count: 5,
	// 				subjects_count: 7,
	// 				age_range: {
	// 					min: 10,
	// 					max: 20
	// 				},
	// 				gender: ['Male', 'Female'],
	// 				modality: ['PET'],
	// 				body_parts: ['Colon'],
	// 				description: 'Example Collection 4 from ProCancer1'
	// 			}
	// 		]
	// 	}
	// ];
	let expanded: boolean[] = new Array(1).fill(false);

	const toggleExpand = (index: number) => {
		expanded[index] = !expanded[index];
		const img: HTMLElement | null = document.getElementById(`expand-button-img-${index}`);
		if (!img) return;
		img.classList.toggle('expand-button-img-rotate');
	};

	/**
	 * watches the responseStore for changes to update the table
	 */
</script>

<table class="result-table">
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
		{#each response as provider}
			{#each provider.collections as tableRow, index}
				<tr class="table-row">
					<td class="table-cell table-cell-name">{tableRow.name}</td>
					<td class="table-cell">
						{#if provider.provider_icon}
							<img src="{provider.provider_icon}" alt="" />
						{/if}
						{provider.provider}</td
					>
					<td class="table-cell">{tableRow.studies_count}</td>
					<td class="table-cell">{tableRow.subjects_count}</td>
					<td class="table-cell">
						<button class="expand-button" on:click="{() => toggleExpand(index)}"
							><img
								class="expand-button-img expand-button-img-rotate"
								id="expand-button-img-{index}"
								src="right-arrow-svgrepo-com.svg"
								alt="toggle additional information icon"
							/></button
						>
					</td>
				</tr>
				{#if expanded[index]}
					<tr class="table-row">
						<td class="table-cell-hidden" colspan="5">
							<div class="table-cell-hidden-data-wrapper">
								<div>
									Age range: {tableRow.age_range.min} to {tableRow.age_range.max}
								</div>
								<div>
									Gender: {tableRow.gender}
								</div>
								<div>
									Modality: {tableRow.modality}
								</div>
								<div>
									Body parts: {tableRow.body_parts}
								</div>
								<div>
									Description: {tableRow.description}
								</div>
							</div>
						</td>
					</tr>
				{/if}
			{/each}
		{/each}
	</tbody>
</table>

<style>
	.table-cell,
	th {
		text-align: left;
	}
	.table-cell-name {
		color: var(--orange);
	}
	.table-cell-hidden {
		border-bottom: solid var(--gray) 1px;
	}
	.table-cell-hidden-data-wrapper {
		margin: 10px 0 10px 30px;
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
</style>
