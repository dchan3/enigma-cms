import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Metamorph } from 'react-metamorph';
import InnerHtmlRenderer from '../../utils/inner_html_renderer';
import useFrontContext from '../../hooks/useFrontContext.js';
import { get as axget } from 'axios';

function FrontDocumentDisplay() {
  let { state, setState, apiUrl } = useFrontContext({
    dataParams: ['docTypeNamePlural', 'slug'],
    urlParams: ['docType', 'docNode'],
    apiUrl: function({ docType, docNode }) {
      return `/api/documents/get_rendered_document_by_type_and_slug/${docType
      }/${docNode}`;
    }
  });

  useEffect(function() {
    if (!state.dataObj) {
      axget(apiUrl).then(({ data }) => {
        setState({ dataObj: data });
      });
    }
  }, []);

  let { dataObj } = state;

  if (dataObj === undefined) return <Redirect to='/not-found' />;
  else if (dataObj && dataObj.metadata && dataObj.rendered) {
    return [<Metamorph {...dataObj.metadata} />, <div><InnerHtmlRenderer
      innerHtml={dataObj.rendered} /></div>];
  }
  return null;
}

export default FrontDocumentDisplay;
