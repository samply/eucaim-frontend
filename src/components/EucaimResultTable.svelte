<script lang="ts">
	import type { Provider, DatasetMetadata } from '../Types/types';
	import { options } from '../config/options';
	import type { HeaderData } from '@samply/lens';
	import { resultsStore } from '../services/backend.service';
	import { collectionDetails } from '../services/collections.service';

	const metaFields: { label: string; value: (m: DatasetMetadata) => string | undefined }[] = [
		{ label: 'Publisher', value: (m) => m.publisher || undefined },
		{ label: 'Publisher type', value: (m) => m.publisherType || undefined },
		{ label: 'Dataset type', value: (m) => m.datasetType || undefined },
		{ label: 'Interoperability tier', value: (m) => m.interoperabilityTier || undefined },
		{ label: 'Vendors', value: (m) => (m.vendors ? m.vendors.join(', ') : undefined) },
		{ label: 'Access rights', value: (m) => (m.accessRights ? m.accessRights.join(', ') : undefined) },
		{ label: 'Access conditions', value: (m) => m.accessConditions || undefined },
		{ label: 'Version', value: (m) => m.version || undefined },
		{ label: 'Condition', value: (m) => m.condition || undefined },
		{ label: 'Topography', value: (m) => m.topography || undefined },
		{ label: 'Number of series', value: (m) => (m.numberOfSeries != null ? String(m.numberOfSeries) : undefined) },
		{
			label: 'Image year range',
			value: (m) => {
				const { start, end } = m.imageYearRange ?? {};
				if (start && end) return start === end ? start : `${start} to ${end}`;
				return start ?? end;
			}
		},
		{ label: 'Image size (GB)', value: (m) => (m.imageSizeGB != null ? String(m.imageSizeGB) : undefined) },
		{ label: 'Geographical coverage', value: (m) => m.geographicCoverage || undefined },
		{
			label: 'Collection methods',
			value: (m) => (m.collectionMethods ? m.collectionMethods.join(', ') : undefined)
		},
		{ label: 'Provenance', value: (m) => m.provenance || undefined },
		{ label: 'Intended purpose', value: (m) => (m.intendedPurpose ? m.intendedPurpose.join(' ') : undefined) },
		{
			label: 'Commercial use',
			value: (m) => (m.commercialUse === undefined ? undefined : m.commercialUse ? 'Yes' : 'No')
		},
		{ label: 'Applicable legislation', value: (m) => m.applicableLegislation || undefined },
		{ label: 'Legal basis', value: (m) => m.legalBasis || undefined }
	];

	let response: Provider[] = $state([]);
	let expanded = $state<Record<string, boolean>>({});

	let catalogueLink: string =
		'https://catalogue.eucaim.cancerimage.eu/Eucaim/eucaim-ui/#/dataset/';
	let headerData: HeaderData[] = $derived(options?.tableOptions?.headerData || []);
	resultsStore.subscribe((value) => {
		response = value;
	});
	const toggleExpand = (index: string) => {
		expanded = { ...expanded, [index]: !expanded[index] };
		const img: HTMLElement | null = document.getElementById(`expand-button-img-${index}`);
		if (!img) return;
		img.classList.toggle('expand-button-img-rotate');
	};
</script>

<table cellspacing="0" class="result-table">
	<thead class="table-header">
		<tr class="table-header-row">
			{#each headerData as header, index (index)}
				<th class="table-header-cell table-header-datatype">
					{header.title}
				</th>
			{/each}
			<th class="expand-header"></th>
		</tr>
	</thead>
	<tbody class="table-body">
		{#each response as provider, index1 (index1)}
			{#each provider.collections as tableRow, index2 (index2)}
				{@const meta = $collectionDetails[tableRow.id]}
				{@const modalities = meta?.modalities?.length
					? meta.modalities
					: [...new Set([...(tableRow.modality ?? []), ...(tableRow.modalities ?? [])])]}
				<tr
					class="table-row"
					class:expanded-row={expanded[index1.toString() + index2.toString()]}
				>
					<td class="table-cell table-cell-name" style="width:30%">
						<a href="{catalogueLink}{tableRow.id}" target="_blank">{meta?.title ?? tableRow.name}</a>
					</td>
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
					<td class="table-cell" style="width:18%">{meta?.numberOfStudies ?? tableRow.studies_count}</td>
					<td class="table-cell" style="width:18%">{meta?.numberOfSubjects ?? tableRow.subjects_count}</td>
					<td class="table-cell" style="width:4%">
						<button
							class="expand-button"
							onclick={() => toggleExpand(index1.toString() + index2.toString())}
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
									<tbody>
										<tr class="table-row">
											<td class="collection-name">Age range: </td><td
												class="collection-value"
												>{tableRow.age_range.min} to {tableRow.age_range.max}</td
											>
										</tr>
										<tr class="table-row">
											<td class="collection-name">Gender: </td><td
												class="collection-value">{(meta?.sex ?? tableRow.gender).join(', ')}</td
											>
										</tr>
										<tr class="table-row">
											<td class="collection-name">Modality: </td><td
												class="collection-value"
												>{modalities.join(', ')}</td
											>
										</tr>
										<tr class="table-row">
											<td class="collection-name">Body parts: </td><td
												class="collection-value">{(meta?.bodyParts ?? tableRow.body_parts).join(', ')}</td
											>
										</tr>
										<tr class="table-row">
											<td class="collection-name">Description: </td><td
												class="collection-value">{meta?.description ?? tableRow.description}</td
											>
										</tr>
										{#if meta}
											{#each metaFields as field (field.label)}
												{@const value = field.value(meta)}
												{#if value !== undefined}
													<tr class="table-row">
														<td class="collection-name">{field.label}: </td><td
															class="collection-value">{value}</td
														>
													</tr>
												{/if}
											{/each}
										{/if}
									</tbody>
								</table>
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
		padding: 0.5em 0 0.5em 10px;
	}
	.table-cell-name a {
		color: var(--orange);
		text-decoration: none;
	}
	.table-cell-name a:hover {
		text-decoration: underline;
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
	.collection-name {
		width: 30%;
	}
	.expanded-row {
		font-weight: bold;
	}
</style>
