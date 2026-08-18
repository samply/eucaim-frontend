import type { RequestHandler } from './$types';

const CATALOGUE_ORIGIN = 'https://catalogue.eucaim.cancerimage.eu';

export const GET: RequestHandler = async ({ params, url, fetch }) => {
	const target = `${CATALOGUE_ORIGIN}/${params.path}${url.search}`;
	const upstream = await fetch(target);
	const body = await upstream.text();
	return new Response(body, {
		status: upstream.status,
		headers: {
			'content-type': upstream.headers.get('content-type') ?? 'text/turtle'
		}
	});
};
