import TemplateParser from './template_parser';
import fs from 'fs';
import path from 'path';

let renderMarkup = async function (templateBody, stuff) {
  let shortcodes = {}, code = '';
  if (fs.exists(path.join(process.env.DIRECTORY || __dirname, 'site-files/shortcodes.js'))) {
    fs.readFileSync(path.join(process.env.DIRECTORY || __dirname, 'site-files/shortcodes.js'), 'utf8');
    shortcodes = eval(`(function() { return ${code}; })()`);
  }
  
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
