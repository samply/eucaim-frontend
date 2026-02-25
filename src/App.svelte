<script lang="ts">
	import './app.css';
	import {
		setOptions,
		setCatalogue,
		type LensOptions,
		type Catalogue
	} from '@samply/lens';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	// conditional import for SSR
	if (browser) import('@samply/lens');

	import { options } from './config/options';
	import { catalogueText, fetchData } from './services/catalogue.service';
	import EucaimResultTable from './components/EucaimResultTable.svelte';
	import { callBackend } from './services/backend.service';

	let catalogueopen = false;
	let catalogueCollapsable = true;

	let mobileNavOpen = false;
	const toggleMobileNav = () => {
		mobileNavOpen = !mobileNavOpen;
	};

	window.addEventListener('resize', () => {
		if (window.innerWidth <= 768) {
			mobileNavOpen = false;
			catalogueCollapsable = true;
		} else if (window.innerWidth > 768 && window.innerWidth < 1024) {
			mobileNavOpen = true;
			catalogueCollapsable = true;
		} else if (window.innerWidth >= 1024) {
			catalogueCollapsable = false;
		}
	});

	if (window.innerWidth >= 1024) {
		catalogueCollapsable = false;
	}

	window.addEventListener('lens-search-triggered', () => {
		callBackend();
	});

	onMount(() => {
		setOptions(options as LensOptions);
		let catalogueDataPromise = fetchData('/catalogues/catalogue-eucaim.json');

		catalogueDataPromise.then((catalogue: Catalogue) => {
			setCatalogue(catalogue);
		});

		// Add tooltips to table headers after component mounts
		const headers = document.querySelectorAll('.table-header-cell');
		headers.forEach((header, index) => {
			const headerData = options?.tableOptions?.headerData?.[index];
			if (headerData && 'tooltip' in headerData && headerData.tooltip) {
				// Create tooltip icon
				const tooltipIcon = document.createElement('img');
				tooltipIcon.src = 'info-circle-svgrepo-com.svg';
				tooltipIcon.className = 'header-tooltip-icon';
				tooltipIcon.title = String(headerData.tooltip);
				tooltipIcon.alt = 'info';

				// Append icon to header
				header.appendChild(tooltipIcon);
			}
		});
	});
</script>

<header>
	<div>
		<a href="https://dashboard.eucaim.cancerimage.eu/">
			<img src="../assets/images/logoEUCAIM_nav@1.5x-8.png" alt="" />
		</a>
	</div>
	<button
		class="burger-menu-button"
		on:click={toggleMobileNav}
		aria-label="Toggle navigation menu"
	>
		<div></div>
		<div></div>
		<div></div>
	</button>
	{#if mobileNavOpen}
		<div>
			<nav>
				<ul>
					<li>
						<a href="https://dashboard.eucaim.cancerimage.eu/">HOME</a>
					</li>
					<li>
						<a href="https://catalogue.eucaim.cancerimage.eu/">PUBLIC CATALOGUE</a>
					</li>
					<li>
						<a href="https://help.cancerimage.eu/#login">HELPDESK</a>
					</li>
				</ul>
			</nav>
		</div>
	{/if}
</header>

<main>
	<div class="search">
		<div class="search-wrapper">
			<lens-search-bar-multiple noMatchesFoundMessage={'No collections found'}
			></lens-search-bar-multiple>
			<lens-query-explain-button
				noQueryMessage="Query with no criteria selected: Searches for all collections."
			></lens-query-explain-button>
			<lens-search-button title="Search"></lens-search-button>
		</div>
	</div>
	<div class="grid">
		<div class="catalogue-wrapper">
			<div class="catalogue">
				<lens-catalogue
					toggleIconUrl="right-arrow-svgrepo-com.svg"
					addIconUrl="long-right-arrow-svgrepo-com.svg"
					infoIconUrl="info-circle-svgrepo-com.svg"
					texts={catalogueText}
					toggle={{ collapsable: catalogueCollapsable, open: catalogueopen }}
				></lens-catalogue>
			</div>
		</div>
		<div class="charts">
			<div class="chart-wrapper result-summary">
				<lens-result-summary></lens-result-summary>
			</div>

			<div class="chart-wrapper">
				<lens-chart
					title="Studies per Collection"
					catalogueGroupCode="Studies"
					chartType="pie"
					displayLegends={true}
					datakey="studies"
				></lens-chart>
			</div>

			<div class="chart-wrapper result-table">
				<EucaimResultTable />
			</div>
		</div>
	</div>

	<div class="credits">
		<p>
			This federated search was made with the open source <a
				href="https://github.com/samply/">Samply tools</a
			>
			(<a href="https://github.com/samply/lens/">Lens</a>,
			<a href="https://github.com/samply/beam/">Beam</a>,
			<a href="https://github.com/samply/focus/">Focus</a>,
			<a href="https://github.com/samply/bridgehead/">Bridgehead</a>), created by the
			<a href="https://www.dkfz.de/en/verbis/">German Cancer Research Center (DKFZ)</a>.
		</p>
	</div>
</main>

<footer>
	<div class="logo">
		<a href="https://dashboard.eucaim.cancerimage.eu/">
			<img src="../assets/images/logo_EUCAIM_footer@2x-8.png" alt="" />
		</a>
	</div>
	<div class="links">
		<a href="https://dashboard.eucaim.cancerimage.eu/privacy-policy">PRIVACY POLICY</a>
		<a href="http://localhost:4200/#">COOKIES POLICY</a>
	</div>
</footer>

<lens-data-passer></lens-data-passer>

<style>
	:global(.header-tooltip-icon) {
		width: 14px;
		height: 14px;
		margin-left: 6px;
		vertical-align: middle;
		opacity: 0.7;
	}

	:global(.header-tooltip-icon:hover) {
		opacity: 1;
	}
</style>
