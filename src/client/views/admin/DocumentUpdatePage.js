import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GeneratedForm from '../../reusables/GeneratedForm';
import { default as urlUtils } from '../../../lib/utils';

class DocumentUpdatePage extends Component {
  static propTypes = {
    match: PropTypes.object,
    staticContext: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      document: null,
      docType: null,
      canDisplay: false
    }
  }

  redirect() {
    window.location.href = this.state.docType ?
      `/admin/edit/${this.state.docType}` : '/admin';
  }

  render() {
    var params = {};
    if (this.state.document !== null && this.state.docType !== null &&
      this.state.canDisplay) {
      this.state.docType.attributes.forEach(attr => {
        params[attr.attrName] = {
          label: attr.attrName,
          type: attr.attrType,
          value: this.state.document.content[attr.attrName],
        };

        if (attr.grammar) {
          params[attr.attrName].grammar = attr.grammar;
        }
      });

      return <GeneratedForm title='Edit Document'
        params={params} method="post" successCallback={this.redirect}
        formAction={urlUtils.info.path(`/api/documents/update_document/${ 
          this.props.match.params.docNode}`)}
      />;
    }
    else return null;
  }
}

export default DocumentUpdatePage;
