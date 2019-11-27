import React from 'react';
import TheRedirect from '../../the_router/TheRedirect';
import { Metamorph } from 'react-metamorph';
import InnerHtmlRenderer from '../../utils/inner_html_renderer';
import useFrontContext from '../../hooks/useFrontContext.js';

function FrontDocumentDisplay() {
  let { state } = useFrontContext({
      dataParams: ['slug'],
      urlParams: ['docNode'],
      apiUrl: function({ docType, docNode }) {
        return `documents/get_rendered_document_by_type_and_slug/${docType
        }/${docNode}`;
      }
    }), { dataObj } = state;

  if (dataObj === undefined) return <TheRedirect to='/not-found' />;
  else if (dataObj && dataObj.metadata && dataObj.rendered) {
    return [<Metamorph {...dataObj.metadata} />, <div><InnerHtmlRenderer
      innerHtml={dataObj.rendered} /></div>];
  }
  return null;
}

export default FrontDocumentDisplay;
