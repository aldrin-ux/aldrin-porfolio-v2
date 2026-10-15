import type { SiteSettings, PortfolioProfile, ProfessionalExperience, Project, Navigation, Page } from './schema.types';
export type CmsDocument = SiteSettings | PortfolioProfile | ProfessionalExperience | Project | Navigation | Page;
export interface PublicAsset {
  _id: string; _type: 'sanity.imageAsset'; _rev: string; url: string;
  metadata: { dimensions: { width: number; height: number; aspectRatio?: number } };
}
export interface PublishedSnapshot { documents: CmsDocument[]; assets: PublicAsset[] }
export interface TypedQuery<T> { text: string; params: Record<string, unknown>; readonly __result?: T }
export interface ImageVariant { src: string; srcset: string; width: number; height: number }
export interface LocalMediaBinding {
  assetId: string; originalPath: string; publicPath: string; sourceFile: string; sha256: string;
  variantHashes: Record<string, string>;
  card?: ImageVariant; study?: ImageVariant; hero?: ImageVariant; aboutPortrait?: boolean;
}
export interface PublicationPolicy {
  assertDocument(id: string, revision: string, digest: string): boolean | Promise<boolean>;
  resolveMedia(input: { usage: unknown; path: string; asset: PublicAsset }): LocalMediaBinding | undefined | Promise<LocalMediaBinding | undefined>;
}
