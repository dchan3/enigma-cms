import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GeneratedForm from '../../reusables/GeneratedForm';

class DocumentUpdatePage extends Component {
  static propTypes = {
    match: PropTypes.object,
    staticContext: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {
    let params = {}, { doc, docType } = this.props.staticContext.dataObj;
    if (doc && docType) {
      docType.attributes.forEach(attr => {
        params[attr.attrName] = {
          label: attr.attrName,
          type: attr.attrType,
          value: doc.content[attr.attrName],
        };

        if (attr.grammar) {
          params[attr.attrName].grammar = attr.grammar;
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
