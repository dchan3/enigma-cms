import React from 'react';
import { object } from 'prop-types';
import { GeneratedForm } from '../../reusables';

function EditDocumentPage({ match: { params: { docNode } }, staticContext: {
  dataObj: { doc, docType }
} }) {
  let params = {
    draft: {
      type: 'enum',
      enumList: [{
        text: 'Yes', value: true }, {
        text: 'No', value: false
      }]
    }
  };
  if (docType) {
    docType.attributes.forEach(({ attrName, attrType, grammar }) => {
      params[attrName] = {
        label: attrName,
        type: attrType
      };

      if (grammar) {
        params[attrName].grammar = grammar;
      }
    });

    let { docTypeId } = docType;

    return <GeneratedForm title='Edit Document' {...{ params }} method="post"
      currentValue={doc} formAction={doc ?
        `/api/documents/update_document/${docNode}` :
        `/api/documents/new_document/${docTypeId}`
      } redirectUrl={`/admin/edit/${docTypeId}`}
    />;
  }
  else return null;
}

EditDocumentPage.propTypes = {
  match: object,
  staticContext: object
};

export default EditDocumentPage;
