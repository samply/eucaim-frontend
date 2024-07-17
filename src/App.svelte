<script lang="ts">
	import options from './config/options.json';
	import { genderHeaders, measures } from './config/environment';
	import type { LensDataPasser } from '@samply/lens';
	import { catalogueText, getStaticCatalogue } from './services/catalogue.service';

	let catalogueopen = false;
	let catalogueCollapsable = true;
	let catalogueDataPromise = getStaticCatalogue('catalogues/catalogue-eucaim.json');

	let dataPasser: LensDataPasser;

	/**
	 * The following functions are the API to the library stores (state)
	 * here you get information to use in your application
	 * or manipulate the stores
	 * use if needed and import types from @samply/lens
	 */

	// const getQuery = (): void => {
	// 	console.log('getQuery()', dataPasser.getQueryAPI());
	// };

	// const getResponse = (): void => {
	// 	console.log('getResponse()', dataPasser.getResponseAPI());
	// };

	// const getAST = (): void => {
	// 	console.log('getAst()', dataPasser.getAstAPI());
	// };

	// const removeItem = (queryObject: QueryItem): void => {
	// 	console.log('removeItem()', queryObject);
	// 	dataPasser.removeItemFromQuyeryAPI({ queryObject });
	// 	getQuery();
	// };

	// const removeValue = (queryItem: QueryItem, value: QueryValue): void => {
	// 	console.log('removeValue()', queryItem, value);
	// 	dataPasser.removeValueFromQueryAPI({ queryItem, value });
	// 	getQuery();
	// };
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
</script>

<header>
	<div>
		<a href="https://dashboard.eucaim.cancerimage.eu/">
			<img src="../assets/images/logoEUCAIM_nav@1.5x-8.png" alt="" />
		</a>
	</div>
	<button class="burger-menu-button" on:click="{toggleMobileNav}">
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
			<lens-search-bar-multiple noMatchesFoundMessage="{'keine Ergebnisse gefunden'}"
			></lens-search-bar-multiple>
			<lens-info-button
				noQueryMessage="Leere Suchanfrage: Sucht nach allen Ergebnissen."
				showQuery="{true}"
			></lens-info-button>
			<lens-search-button title="Suchen"></lens-search-button>
		</div>
	</div>
	<div class="grid">
		<div class="catalogue-wrapper">
			<div class="catalogue">
				<lens-catalogue
					toggleIconUrl="right-arrow-svgrepo-com.svg"
					addIconUrl="long-right-arrow-svgrepo-com.svg"
					infoIconUrl="info-circle-svgrepo-com.svg"
					texts="{catalogueText}"
					toggle="{{ collapsable: catalogueCollapsable, open: catalogueopen }}"
				></lens-catalogue>
			</div>
		</div>
		<div class="charts">
			<div class="chart-wrapper result-summary">
				<lens-result-summary></lens-result-summary>
			</div>

			<div class="chart-wrapper">
				<lens-chart
					title="Geschlecht"
					catalogueGroupCode="gender"
					chartType="pie"
					displayLegends="{true}"
					headers="{genderHeaders}"
				></lens-chart>
			</div>

			<div class="chart-wrapper result-table">
				<lens-result-table pageSize="10"> </lens-result-table>
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

{#await catalogueDataPromise}
	Loading catalogue...
{:then catalogueData}
	<lens-options {options} {catalogueData} {measures}></lens-options>
{:catch someError}
	System error: {someError.message}.
{/await}

<lens-data-passer bind:this="{dataPasser}"></lens-data-passer>
