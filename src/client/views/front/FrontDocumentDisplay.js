import React, { useState, useEffect, useContext } from 'react';
import { get as axget } from 'axios';
import { Redirect } from 'react-router-dom';
import { Metamorph } from 'react-metamorph';
import GeneralContext from '../../contexts/GeneralContext';

function FrontDocumentDisplay() {
  let { generalState } = useContext(GeneralContext),
    { staticContext, match: { params: { docType, docNode } } } = generalState,
    [state, setState] = useState({
      dataObj: staticContext.dataObj &&
      staticContext.dataObj.slug &&
      staticContext.dataObj.slug === docNode &&
      staticContext.dataObj || null
    });

  useEffect(function() {
    let { dataObj } = state;
    if (!dataObj) {
      axget(
        `/api/documents/get_rendered_document_by_type_and_slug/${docType
        }/${docNode}`)
        .then(
          ({ data }) => {
            setState({ dataObj: data })
          })
    }
  }, []);

  let { dataObj } = state;
  if (dataObj === undefined) return <Redirect to='/not-found' />;
  else if (dataObj && dataObj.metadata && dataObj.rendered) {
    return [<Metamorph {...dataObj.metadata} />, <div dangerouslySetInnerHTML=
      {{ __html: dataObj.rendered }} />];
  }
  return null;
}

export default FrontDocumentDisplay;
