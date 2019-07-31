import React, { useEffect, useState, useContext } from 'react';
import { get as axget } from 'axios';
import { GeneratedForm } from '../../reusables';
import GeneralContext from '../../contexts/GeneralContext';

function EditDisplayTemplate() {
  let { generalState } = useContext(GeneralContext),
    { staticContext, match: { params: { docTypeId } } } =
      generalState, [state, setState] = useState({
      dataObj: staticContext.dataObj && docTypeId &&
      staticContext.dataObj.docType &&
    staticContext.dataObj.docTypeId === parseInt(docTypeId)
    && staticContext.dataObj || null
    });

  useEffect(function() {
    let { dataObj } = state;
    if (!dataObj) {
      axget(`/api/documents/get_template/${docTypeId}`).then(({ data }) => {
        setState({ dataObj: data })
      });
    }
  }, []);

  if (state.dataObj) {
    let { docType, templateBody, categoryTemplateBody } = state.dataObj;

    if (docType !== null && templateBody !== null
      && categoryTemplateBody !== null) {
      let { docTypeName } = docType;
      return <GeneratedForm title={`Edit ${docTypeName} Display Template`}
        currentValue={{ ...{ templateBody, categoryTemplateBody } }}params={{
          templateBody: {
            type: 'text',
            grammar: 'html'
          },
          categoryTemplateBody: {
            type: 'text',
            grammar: 'html'
          } }} method="post" redirectUrl='/admin'
        formAction={`/api/documents/update_template/${docTypeId}`} />;
    }
    else return null;
  }
  else return null;
}

export default EditDisplayTemplate;
