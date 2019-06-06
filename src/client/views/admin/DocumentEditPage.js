import React from 'react';
import { object } from 'prop-types';
import { GeneratedForm } from '../../reusables';

function DocumentEditPage({ staticContext }) {
  let params = {}, { docType } = staticContext;
  if (docType) {
    docType.attributes.forEach(({
      attrName, attrType, grammar, maximum, minimum }) => {
      params[attrName] = {
        label: attrName,
        type: attrType,
      };

      if (grammar) {
        params[attrName].grammar = grammar;
      }

      if (maximum) {
        params[attrName].maximum = maximum;
      }

      if (minimum) {
        params[attrName].minimum = minimum;
      }
    });

    params.draft = {
      type: 'enum',
      enumList: [{
        text: 'Yes', value: true }, {
        text: 'No', value: false
      }]
    };
  }
  else return null;

  let { docTypeName, docTypeId } = docType

  return <GeneratedForm
    title={`New ${docTypeName}`} params={params} method="post"
    formAction={`/api/documents/new_document/${docTypeId}`}
    redirectUrl={`/admin/edit/${docTypeId}`}
  />;
}

DocumentEditPage.propTypes = {
  staticContext: object
}

export default DocumentEditPage;
