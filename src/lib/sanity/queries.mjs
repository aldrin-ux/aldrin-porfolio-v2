import { documentTypes, models, sectionTypes } from './model.mjs';

const meta = '_id,_type,_rev,_createdAt,_updatedAt';
function projection(type) {
  return `_type,${Object.entries(models[type]).map(([name, field]) => `${name}${suffix(field)}`).join(',')}`;
}
function suffix(field) {
  if (field.kind === 'object') return `{${projection(field.type)}}`;
  if (field.kind === 'reference') return '{_type,_ref,_weak}';
  if (field.kind === 'array') return `[]${field.item.kind === 'object' ? `{_key,${projection(field.item.type)}}` : field.item.kind === 'reference' ? '{_key,_type,_ref,_weak}' : suffix(field.item)}`;
  if (field.kind === 'slug') return '{_type,current}';
  if (field.kind === 'portableText') return `[]{_key,_type,style,children[]{_key,_type,text,marks},markDefs[]{_key,${projection('link')}}}`;
  if (field.kind === 'sections') return `[]{_key,${sectionTypes.map(t => `_type == "${t}" => {${projection(t)}}`).join(',')}}`;
  return '';
}
/** @type {import('./types').TypedQuery<import('./types').CmsDocument[]>} */
export const documentsQuery = {
  text: `*[_type in $types && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]{${meta},${documentTypes.map(t => `_type == "${t}" => {${projection(t)}}`).join(',')}}`,
  params: { types: documentTypes },
};
/** @type {import('./types').TypedQuery<import('./types').PublicAsset[]>} */
export const assetsQuery = {
  text: '*[_type == "sanity.imageAsset" && _id in $ids]{_id,_type,_rev,url,metadata{dimensions{width,height,aspectRatio}}}',
  params: {},
};
export const revisionsQuery = { text: '*[_type in $types && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]{_id,_rev}', params: { types: documentTypes } };
