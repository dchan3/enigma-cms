import React from 'react';
import { SamePageAnchor } from '../reusables';
import parse from 'html-react-parser';

function InnerHtmlRenderer({ innerHtml }) {
  return parse(innerHtml, {
    replace: domNode => {
      if (domNode.type === 'tag' && domNode.name === 'a') {
        return <SamePageAnchor {...domNode.attribs}>
          {domNode.children.map(({ data }) => data)}</SamePageAnchor>;
      }
    }
  });
}

export default InnerHtmlRenderer;
