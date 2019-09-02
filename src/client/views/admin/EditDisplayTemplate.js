import React, { useEffect } from 'react';
import { GeneratedForm } from '../../reusables';
import useFrontContext from '../../hooks/useFrontContext';
import { get as axget } from 'axios';

function EditDisplayTemplate() {
  let { state, setState, apiUrl } = useFrontContext({
    dataParams: ['docTypeId'],
    urlParams: ['docTypeId'],
    apiUrl: function({ docTypeId }) {
      return `/api/documents/get_template/${docTypeId}`;
    }
  });

  useEffect(function() {
    axget(apiUrl).then(({ data }) => setState({ dataObj: data }));
  }, []);

  let { dataObj } = state;

  if (dataObj) {
    let { docType, templateBody, categoryTemplateBody } = dataObj;

    if (docType !== null && templateBody !== null
      && categoryTemplateBody !== null) {
      let { docTypeName, docTypeId } = docType;
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
