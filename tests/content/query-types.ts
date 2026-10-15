import type { TypedQuery, CmsDocument, PublicAsset, PublishedSnapshot } from '../../src/lib/sanity/types';
import { documentsQuery, assetsQuery } from '../../src/lib/sanity/queries.mjs';
import { retrieveSnapshot } from '../../src/lib/sanity/retrieve.mjs';
const documents: TypedQuery<CmsDocument[]> = documentsQuery;
const images: TypedQuery<PublicAsset[]> = assetsQuery;
// Expected query result types remain distinct across adapters.
// @ts-expect-error Documents are not image assets.
const incorrect: TypedQuery<PublicAsset[]> = documentsQuery;
const snapshot: Promise<PublishedSnapshot> = retrieveSnapshot(async () => []);
void [documents, images, incorrect, snapshot];
