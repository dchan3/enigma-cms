import { SiteConfig } from '../models';

export const documentMetadata = async function (content) {
  let { siteName, keywords } =  await SiteConfig.findOne({}), attrs = {
    title: content['title'] || content['name'] || '',
    description: content['description'] || content['summary'] ||
      content['synopsis'] || '',
    image: content['image'] || content['img'] || content['picture'] ||
     content['pic'] || content['photo'],
    keywords: content['tags'] || content['keywords'] ||
      content['buzzwords'] || ''
  };

  attrs.title += attrs.title.length ? ` | ${siteName}` : siteName;
  attrs.keywords = typeof attrs.keywords === 'string' ?
    [attrs.keywords, ...keywords] : [attrs.keywords, ...keywords];

  return attrs;
}

export const categoryMetadata = async function (docTypeNamePlural) {
  let { siteName } = await SiteConfig.findOne({})
  return {
    title: `${docTypeNamePlural.charAt(0).toUpperCase() +
      docTypeNamePlural.slice(1)} | ${siteName}`,
    description: `${docTypeNamePlural.charAt(0).toUpperCase() +
      docTypeNamePlural.slice(1)} on ${siteName}`
  }
}
