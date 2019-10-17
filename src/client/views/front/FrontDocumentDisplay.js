import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Metamorph } from 'react-metamorph';
import InnerHtmlRenderer from '../../utils/inner_html_renderer';
import { default as requests } from '../../utils/api_request_async';
import useFrontContext from '../../hooks/useFrontContext.js';

function FrontDocumentDisplay() {
  let { state, setState, apiUrl } = useFrontContext({
    dataParams: ['slug'],
    urlParams: ['docNode'],
    apiUrl: function({ docType, docNode }) {
      return `documents/get_rendered_document_by_type_and_slug/${docType
      }/${docNode}`;
    }
  });

  function getData() {
    requests.getRequest(apiUrl, function(dataObj) {
      setState({ dataObj });
    });
  }

  useEffect(function() {
    if (!state.dataObj) {
      getData();
    }
  }, [state.dataObj]);

  let { dataObj } = state;

  if (dataObj === undefined) return <Redirect to='/not-found' />;
  else if (dataObj && dataObj.metadata && dataObj.rendered) {
    return [<Metamorph {...dataObj.metadata} />, <div><InnerHtmlRenderer
      innerHtml={dataObj.rendered} /></div>];
  }
  return null;
}

export default FrontDocumentDisplay;
