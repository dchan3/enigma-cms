import TemplateParser from './template_parser';

let renderMarkup = async function (templateBody, stuff) {
  let shortcodes = require('../../../site-files/shortcodes.js');

  for (let key in shortcodes) {
    TemplateParser.registerHelper(key, shortcodes[key]);
  }
  let template = TemplateParser.compile(templateBody), retval = template(stuff);

  return retval;
}

export default renderMarkup;

export function prepareDocumentsForRender(items) {
  return items.map(({
    content, slug, createdAt, editedAt }) => ({
    ...content, slug, createdAt, editedAt
  }));
}
