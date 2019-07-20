import React, { useEffect, useState } from 'react';
import { object } from 'prop-types';
import { get as axget } from 'axios';
import { GeneratedForm } from '../../reusables';

function EditDisplayTemplate({ match: { params: { docTypeId } }, staticContext
}) {
  let [state, setState] = useState({
    dataObj: staticContext.dataObj && docTypeId &&
      staticContext.dataObj.docType &&
    staticContext.dataObj.docTypeId === parseInt(docTypeId)
    && staticContext.dataObj || null
  });

  useEffect(function() {
    let { dataObj } = staticContext;
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

EditDisplayTemplate.propTypes = {
  match: object,
  staticContext: object
};

export default EditDisplayTemplate;
