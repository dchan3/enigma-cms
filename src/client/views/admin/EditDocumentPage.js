import React, { useState, useEffect } from 'react';
import { get as axget } from 'axios';
import { object } from 'prop-types';
import { GeneratedForm } from '../../reusables';
import { Redirect } from 'react-router-dom';

function EditDocumentPage({ match: { params: { docNode, docTypeId } },
  staticContext }) {
  let [state, setState] = useState({
      dataObj: staticContext.dataObj &&
        ((staticContext.dataObj.docType &&
        staticContext.dataObj.docType.docTypeId === parseInt(docTypeId)) ||
        (staticContext.dataObj.doc &&
        staticContext.dataObj.doc.docNodeId === parseInt(docNode))) &&
        staticContext.dataObj || null
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
    let { dataObj } = state;
    if (dataObj) {
      setState({ dataObj });
    }
    else {
      axget(docNode ?
        `/api/documents/get_document_and_type_info/${docNode}` :
        `/api/documents/get_type_2/${docTypeId}`
      ).then(({ data }) => {
        setState({ dataObj: data })
      });
    }
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
        formAction: docNode ?
          `/api/documents/update_document/${docNode}` :
          `/api/documents/new_document/${docTypeId}`
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

EditDocumentPage.propTypes = {
  match: object,
  staticContext: object
};

export default EditDocumentPage;
