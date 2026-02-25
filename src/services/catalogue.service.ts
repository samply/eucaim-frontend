// This file includes a function to the the catalogue
export const fetchData = async (catalogueUrl: string): Promise<unknown> => {
	const response = await fetch(catalogueUrl);
	return response.json();
};

export const catalogueText = {
	group: 'Group',
	collapseButtonTitle: 'Collapse Tree',
	expandButtonTitle: 'Expand Tree',
	numberInput: {
		labelFrom: 'von',
		labelTo: 'bis'
	}
};
