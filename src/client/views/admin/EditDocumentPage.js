import React from 'react';
import { GeneratedForm, AdminFrame } from '../../reusables';
import TheRedirect from '../../the_router/TheRedirect';
import useFrontContext from '../../hooks/useFrontContext';

function EditDocumentPage() {
  let { state } = useFrontContext({
      dataParams: ['doc.docNodeId', 'docType.docTypeId'],
      urlParams: ['docNode', 'docTypeId'],
      apiUrl: function({ docTypeId, docNode }) {
        return `documents/${docNode ? `get_document_and_type_info/${docNode}`
          : `get_type_2/${docTypeId}`}`;
      }
    }), params = {
      draft: {
        type: 'enum',
        enumList: [{
          text: 'Yes', value: true }, {
          text: 'No', value: false
        }]
      }
    }, { dataObj } = state;

  if (dataObj === undefined) {
    return <TheRedirect to="/admin" />;
  }
  else if (dataObj) {
    let { docType, doc } = dataObj;
    if (docType) {
      docType.attributes.forEach(({ attrName, attrType, grammar, repeatable
      }) => {
        params[attrName] = {
          label: attrName,
          type: repeatable ? `[${attrType}]` : attrType
        };

        if (grammar) {
          params[attrName].grammar = grammar;
        }
      });

      var obj = {
        formAction:
          `documents/${dataObj.doc ?
            `update_document/${dataObj.doc.docNodeId}` :
            `new_document/${dataObj.docType.docTypeId}`}`
      };

      if (doc && doc.content) obj.currentValue = {
        draft: doc.draft,
        ...doc.content
      }
      else if (doc) obj.currentValue = {
        draft: doc.draft
      }

      return <AdminFrame><GeneratedForm title='Edit Document' {...{ params }}
        {...obj} redirectUrl='/admin' /></AdminFrame>;
    }
    else return null;
  }
  else return null;
}

export default EditDocumentPage;
