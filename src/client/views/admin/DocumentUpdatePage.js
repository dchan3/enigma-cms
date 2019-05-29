import React, { Component } from 'react';
import { object } from 'prop-types';
import GeneratedForm from '../../reusables/GeneratedForm';

class DocumentUpdatePage extends Component {
  static propTypes = {
    match: object,
    staticContext: object
  };

  constructor(props) {
    super(props);
  }

  render() {
    let params = {}, { doc, docType } = this.props.staticContext.dataObj;
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
        formAction={`/api/documents/update_document/${
          this.props.match.params.docNode}`}
      />;
    }
    else return null;
  }
}

export default DocumentUpdatePage;
