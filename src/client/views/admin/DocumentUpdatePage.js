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

  redirect() {
    window.location.href = this.props.staticContext.dataObj.docType ?
      `/admin/edit/${this.props.staticContext.dataObj.docType}` : '/admin';
  }

  render() {
    var params = {}, { doc, docType } = this.props.staticContext.dataObj;
    if (doc && docType) {
      docType.attributes.forEach(attr => {
        params[attr.attrName] = {
          label: attr.attrName,
          type: attr.attrType,
          value: document.content[attr.attrName],
        };

        if (attr.grammar) {
          params[attr.attrName].grammar = attr.grammar;
        }
      });

      return <GeneratedForm title='Edit Document'
        params={params} method="post" successCallback={this.redirect}
        formAction={`/api/documents/update_document/${ 
          this.props.match.params.docNode}`}
      />;
    }
    else return null;
  }
}

export default DocumentUpdatePage;
