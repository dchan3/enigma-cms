import React, { useEffect } from 'react';
import { GeneratedForm } from '../../reusables';
import { Redirect } from 'react-router-dom';
import useFrontContext from '../../hooks/useFrontContext';
import { get as axget } from 'axios';

function EditDocumentPage() {
  let { state, setState, apiUrl } = useFrontContext({
      dataParams: ['doc.docNodeId', 'docType.docTypeId'],
      urlParams: ['docNode', 'docTypeId'],
      apiUrl: function({ docTypeId, docNode }) {
        return docNode ? `/api/documents/get_document_and_type_info/${docNode}`
          : `/api/documents/get_type_2/${docTypeId}`;
      }
    }), params = {
      draft: {
        type: 'enum',
        enumList: [{
          text: 'Yes', value: true }, {
          text: 'No', value: false
        }]
      }
    };

  useEffect(function() {
    axget(apiUrl).then(({ data }) => setState({ dataObj: data }));
  }, []);

  let { dataObj } = state;

  if (dataObj === undefined) {
    return <Redirect to="/admin" />;
  }
  else if (dataObj) {
    let { docType, doc } = dataObj;
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

      var obj = {
        formAction: dataObj.doc ?
          `/api/documents/update_document/${dataObj.doc.docNode}` :
          `/api/documents/new_document/${dataObj.docType.docTypeId}`
      };

      if (doc) obj.currentValue = {
        draft: doc.draft,
        ...doc.content
      };

      return <GeneratedForm title='Edit Document' {...{ params }} method="post"
        redirectUrl='/admin' {...obj}  />;
    }
    else return null;
  }
  else return null;
}

export default EditDocumentPage;
