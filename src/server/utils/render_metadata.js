import { SiteConfig } from '../models';

export const documentMetadataSync = function (content) {
  let attrs = {
    title: content['title'] || content['name'] || '',
    description: content['description'] || content['summary'] ||
      content['synopsis'] || '',
    image: content['image'] || content['img'] || content['picture'] ||
     content['pic'] || content['photo'] || '',
    keywords: content['tags'] || content['keywords'] ||
      content['buzzwords'] || ''
  };

  return attrs;
}

export const documentMetadata = async function (content, appendSite = true) {
  let { siteName, keywords, iconUrl, description } =  await SiteConfig.findOne({}),
    attrs = documentMetadataSync(content);

  if (appendSite) {
    attrs.title += attrs.title.length ? ` | ${siteName}` : siteName;
    attrs.description += attrs.description.length ? '' : description;
    attrs.image += attrs.image.length ? attrs.image : (iconUrl || '');
    attrs.keywords = typeof attrs.keywords === 'string' ?
      [attrs.keywords, ...keywords].join(',') : (attrs.keywords.length ? [...attrs.keywords, ...keywords] : [keywords]).join(',');
  }
  return attrs;
}

export const categoryMetadata = async function (docTypeNamePlural) {
  let { siteName, iconUrl, keywords } = await SiteConfig.findOne({});
  return {
    title: `${docTypeNamePlural.charAt(0).toUpperCase() +
      docTypeNamePlural.slice(1)} | ${siteName}`,
    description: `${docTypeNamePlural.charAt(0).toUpperCase() +
      docTypeNamePlural.slice(1)} on ${siteName}`,
    image: iconUrl || '',
    keywords: keywords.join(',')
  }
}

export const profileMetadata = async (props) => {
  if (!props) return null;
  let { displayName, username,
    pictureSrc } = props;
  let { siteName } = await SiteConfig.findOne({}),
    pref = `${displayName || username}'s Profile`, title =
  `${pref} | ${siteName}`, description = `${pref}.`;
  return {
    title, description, image: pictureSrc
  };
}

export const profileMetadataSync = (props) => {
  if (!props) return null;
  let { displayName, username, pictureSrc } = props,
    pref = `${displayName || username}'s Profile`, title = `${pref}`,
    description = `${pref}.`;
  return {
    title, description, image: pictureSrc
  };
}
