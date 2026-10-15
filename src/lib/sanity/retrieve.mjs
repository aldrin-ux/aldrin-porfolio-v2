import { documentsQuery, assetsQuery, revisionsQuery } from './queries.mjs';

export function contentSource(env = process.env) {
  const mode = env.CONTENT_SOURCE ?? 'static';
  if (!['static', 'sanity'].includes(mode)) throw new Error('CONTENT_SOURCE must be static or sanity.');
  return mode;
}
export function assetReferences(value, ids = new Set()) {
  if (value && typeof value === 'object') {
    if (value._type === 'image' && value.asset?._ref) ids.add(value.asset._ref);
    for (const child of Object.values(value)) assetReferences(child, ids);
  }
  return [...ids];
}
/** Build-only HTTP transport. Query paths are fixed; tokens never enter returned data. */
export function createTransport(env, fetcher = fetch) {
  if (env.SANITY_PROJECT_ID !== 'p9xrr86a' || env.SANITY_DATASET !== 'production') throw new Error('Sanity build target is missing or different from the approved project/dataset.');
  const token = env.SANITY_READ_TOKEN;
  return async query => {
    const endpoint = new URL('https://p9xrr86a.api.sanity.io/v2026-10-01/data/query/production');
    endpoint.searchParams.set('perspective', 'published');
    let response;
    // POST to the read-only query endpoint avoids the GET URL limit as asset lists grow.
    try { response = await fetcher(endpoint, { method: 'POST', body: JSON.stringify({ query: query.text, params: query.params }), headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(15000) }); }
    catch { throw new Error('Published content request failed; no static fallback.'); }
    if (!response.ok) throw new Error(`Published content request failed (${response.status}); no static fallback.`);
    let body;
    try { body = await response.json(); }
    catch { throw new Error('Published content response was not valid JSON.'); }
    if (!body || !Array.isArray(body.result)) throw new Error('Published content response was incomplete.');
    return body.result;
  };
}
/** @returns {Promise<import('./types').PublishedSnapshot>} */
export async function retrieveSnapshot(transport) {
  const documents = await transport(documentsQuery);
  const assets = await transport({ ...assetsQuery, params: { ids: assetReferences(documents) } });
  const revisions = await transport(revisionsQuery);
  const manifest = list => JSON.stringify(list.map(d => [d._id, d._rev]).sort(([a], [b]) => a.localeCompare(b)));
  if (manifest(documents) !== manifest(revisions)) throw new Error('Published content changed during retrieval; rebuild from a stable snapshot.');
  return { documents, assets };
}
