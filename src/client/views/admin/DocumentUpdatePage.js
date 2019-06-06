import React from 'react';
import { object } from 'prop-types';
import { GeneratedForm } from '../../reusables';

function DocumentUpdatePage({ match, staticContext }) {
  let params = {}, { doc, docType } = staticContext.dataObj;
  if (doc && docType) {
    docType.attributes.forEach(({ attrName, attrType, grammar }) => {
      params[attrName] = {
        label: attrName,
        type: attrType,
        value: doc.content[attrName],
      };

      if (grammar) {
        params[attrName].grammar = grammar;
      }
    });

    params.draft = {
      type: 'enum',
      enumList: [{
        text: 'Yes', value: true }, {
        text: 'No', value: false
      }]
    };

    return <GeneratedForm title='Edit Document'
      params={params} method="post"
      redirectUrl={docType ? `/admin/edit/${docType.docTypeId}` : '/admin'}
      formAction={`/api/documents/update_document/${match.params.docNode}`}
    />;
  }
  else return null;
}

DocumentUpdatePage.propTypes = {
  match: object,
  staticContext: object
};

export default DocumentUpdatePage;
