import { SamePageAnchor } from '../reusables';
import { default as parse } from './html_to_jsx';

function InnerHtmlRenderer({ innerHtml }) {
  return parse(innerHtml, {
    'a': SamePageAnchor
  });
}

export default InnerHtmlRenderer;
