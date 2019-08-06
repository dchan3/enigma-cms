import Handlebars from 'handlebars';
import { SiteConfig } from '../models';

let renderMarkup = async function (templateBody, stuff) {
  let { shortcodes } = await SiteConfig.findOne({ });

  shortcodes.forEach(
    function({ name, args, code }) {
      Handlebars.registerHelper(name,
        new Function(args.join(','), code));
    });

  let template = Handlebars.compile(templateBody), retval = template(stuff);

  return retval;
}

export default renderMarkup;

export function prepareDocumentsForRender(items) {
  return items.map(({
    content, slug, createdAt, editedAt }) => ({
    ...content, slug, createdAt, editedAt
  }));
}
