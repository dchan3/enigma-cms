import TemplateParser from './template_parser';
import { SiteConfig } from '../models';

let renderMarkup = async function (templateBody, stuff) {
  let { shortcodes } = await SiteConfig.findOne({ });

  shortcodes.forEach(
    function({ name, args, code }) {
      TemplateParser.registerHelper(name,
        new Function(args.join(','), code));
    });

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
