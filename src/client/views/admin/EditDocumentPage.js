import { h } from 'preact'; /** @jsx h **/
import { GeneratedForm } from '../../reusables/back_exports';
import { TheRedirect } from '../../the_router';
import useFrontContext from '../../hooks/useFrontContext';

export default function EditDocumentPage() {
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
          type: (repeatable && repeatable === true) ? `[${attrType}]` : attrType
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

      if (doc && doc.content) {
        obj.currentValue = {
          draft: doc.draft,
          ...doc.content
        };
      }
      else if (doc) obj.currentValue = {
        draft: doc.draft
      }

      return <GeneratedForm title='Edit Document' {...{ params }}
        {...obj} redirectUrl='/admin' />;
    }
    else return null;
  }
  else return null;
}
