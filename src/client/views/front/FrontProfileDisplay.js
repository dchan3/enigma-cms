import React, { useEffect } from 'react';
import { Metamorph } from 'react-metamorph';
import { Redirect } from 'react-router-dom';
import InnerHtmlRenderer from '../../utils/inner_html_renderer';
import useFrontContext from '../../hooks/useFrontContext.js';
import { default as requests } from '../../utils/api_request_async';

function FrontProfileDisplay()
{
  let { state, setState, apiUrl } = useFrontContext({
    dataParams: ['username'],
    urlParams: ['username'],
    apiUrl: function({ username }) {
      return `users/get_user_profile/${username}`;
    }
  });

  useEffect(function() {
    requests.getRequest(apiUrl, (dataObj) => setState({ dataObj }));
  }, []);

  let { dataObj } = state;

  if (dataObj === undefined) return <Redirect to='/not-found' />;
  else if (dataObj && dataObj.metadata && dataObj.rendered) {
    let { rendered, metadata } = dataObj;
    return [<Metamorph {...metadata} />,
      <div><InnerHtmlRenderer innerHtml={rendered} /></div>];
  }
  return null;
}

export default FrontProfileDisplay;
