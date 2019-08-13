import React, { useState, useEffect, useContext } from 'react';
import { get as axget } from 'axios';
import { Metamorph } from 'react-metamorph';
import { Redirect } from 'react-router-dom';
import GeneralContext from '../../contexts/GeneralContext';
import StaticContext from '../../contexts/StaticContext';
import InnerHtmlRenderer from '../../utils/inner_html_renderer';

function FrontProfileDisplay()
{
  let { generalState } = useContext(GeneralContext), { staticContext } =
    useContext(StaticContext), { match: {
      params: { username: urlUsername }
    } } =
    generalState, [state, setState] = useState({
      dataObj: staticContext.dataObj &&
      staticContext.dataObj.username === urlUsername &&
      staticContext.dataObj || null
    });

  useEffect(function() {
    let { dataObj } = state;
    if (!dataObj) {
      axget(
        `/api/users/get_user_profile/${urlUsername}`)
        .then(
          ({ data }) => {
            if (data) setState({ dataObj: data });
            else setState({ dataObj: undefined });
          }).catch(() => setState({ dataObj: undefined }));
    }
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
