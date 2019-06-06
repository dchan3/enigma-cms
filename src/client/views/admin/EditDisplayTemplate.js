import React from 'react';
import { object } from 'prop-types';
import { GeneratedForm } from '../../reusables';

function EditDisplayTemplate({ match, staticContext }) {
  let { docType, templateBody, categoryTemplateBody } = staticContext.dataObj;
  if (docType !== null && templateBody !== null)
    return <GeneratedForm title=
      {`Edit ${docType.docTypeName} Display Template`} params={{
      templateBody: {
        type: 'text',
        grammar: 'html',
        value: templateBody
      },
      categoryTemplateBody: {
        type: 'text',
        grammar: 'html',
        value: categoryTemplateBody
      }
    }} method="post" redirectUrl='/admin'
    formAction={
      `/api/documents/update_template/${match.params.docTypeId}`}
    />;
  else return null;
}

EditDisplayTemplate.propTypes = {
  match: object,
  staticContext: object
};

export default EditDisplayTemplate;
