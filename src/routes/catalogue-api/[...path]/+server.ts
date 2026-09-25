import { catalogueUrl } from '../../../config/options';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, url, fetch, request }) => {
	const target = `${catalogueUrl}/${params.path}${url.search}`;
	const upstream = await fetch(target, { signal: request.signal });
	const body = await upstream.text();
	return new Response(body, {
		status: upstream.status,
		headers: {
			'content-type': upstream.headers.get('content-type') ?? 'text/turtle',
			'cache-control': upstream.ok ? 'public, max-age=3600' : 'no-store'
		}
	});
};
