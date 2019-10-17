import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Metamorph } from 'react-metamorph';
import InnerHtmlRenderer from '../../utils/inner_html_renderer';
import useFrontContext from '../../hooks/useFrontContext.js';
import { default as requests } from '../../utils/api_request_async';

function FrontCategoryDisplay() {
  let { state, setState, apiUrl } = useFrontContext({
    dataParams: ['docTypeNamePlural'],
    urlParams: ['docType'],
    apiUrl: function({ docType }) {
      return `documents/get_rendered_documents_by_type_name/${docType}`;
    }
  });

  function getData() {
    requests.getRequest(apiUrl, function(dataObj) {
      setState({ dataObj })
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
    return [<Metamorph {...dataObj.metadata} />,
      <div><InnerHtmlRenderer innerHtml={dataObj.rendered} /></div>
    ];
  }

  return null;
}

export default FrontCategoryDisplay;
