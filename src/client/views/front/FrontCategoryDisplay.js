import React, { useEffect, useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { Metamorph } from 'react-metamorph';
import { get as axget } from 'axios';
import GeneralContext from '../../contexts/GeneralContext';

function FrontCategoryDisplay() {
  let { generalState } = useContext(GeneralContext),
    { staticContext, match: { params: { docType } } } = generalState,
    [state, setState] = useState({
      dataObj: staticContext.dataObj &&
      staticContext.dataObj.docTypeNamePlural &&
      staticContext.dataObj.docTypeNamePlural === docType &&
      staticContext.dataObj || null
    });

  useEffect(function() {
    let { dataObj } = state;
    if (!dataObj || (dataObj && dataObj.docTypeNamePlural && dataObj.doc)) {
      axget(
        `/api/documents/get_rendered_documents_by_type_name/${docType}`)
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
    return [<Metamorph {...dataObj.metadata} />,
      <div dangerouslySetInnerHTML={{ __html: dataObj.rendered }} />
    ];
  }

  return null;
}

export default FrontCategoryDisplay;
