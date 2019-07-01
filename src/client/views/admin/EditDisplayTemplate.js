import React from 'react';
import { object } from 'prop-types';
import { GeneratedForm } from '../../reusables';

function EditDisplayTemplate({ match: { params: { docTypeId } },
  staticContext: { dataObj: {
    docType, templateBody, categoryTemplateBody
  } } }) {
  if (docType !== null && templateBody !== null) {
    let { docTypeName } = docType;
    return <GeneratedForm title={`Edit ${docTypeName} Display Template`}
      params={{
        templateBody: {
          type: 'text',
          grammar: 'html',
          value: templateBody
        },
        categoryTemplateBody: {
          type: 'text',
          grammar: 'html',
          value: categoryTemplateBody
        } }} method="post" redirectUrl='/admin'
      formAction={`/api/documents/update_template/${docTypeId}`} />;
  }
  else return null;
}

EditDisplayTemplate.propTypes = {
  match: object,
  staticContext: object
};

export default EditDisplayTemplate;
