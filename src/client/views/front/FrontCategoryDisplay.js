import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Metamorph } from 'react-metamorph';
import InnerHtmlRenderer from '../../utils/inner_html_renderer';
import useFrontContext from '../../hooks/useFrontContext.js';
import { get as axget } from 'axios';

function FrontCategoryDisplay() {
  let { state, setState, apiUrl } = useFrontContext({
    dataParams: ['docTypeNamePlural'],
    urlParams: ['docType'],
    apiUrl: function({ docType }) {
      return `/api/documents/get_rendered_documents_by_type_name/${docType}`;
    }
  });

  async function getData() {
    let resp = await axget(apiUrl);
    setState({ dataObj: resp.data });
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
