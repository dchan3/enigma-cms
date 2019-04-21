import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GeneratedForm from '../../reusables/GeneratedForm';

class DocumentEditPage extends Component {
  static propTypes = {
    staticContext: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  redirect() {
    window.location.href =
      `/admin/edit/${this.props.staticContext.docType.docTypeId}`;
  }

  render() {
    let params = {};

    if (this.props.staticContext.docType !== null) {
      this.props.staticContext.docType.attributes.forEach(attr => {
        params[attr.attrName] = {
          label: attr.attrName,
          type: attr.attrType,
        };

        if (attr.grammar) {
          params[attr.attrName].grammar = attr.grammar;
        }

        if (attr.maximum) {
          params[attr.attrName].maximum = attr.maximum;
        }

        if (attr.minimum) {
          params[attr.attrName].minimum = attr.minimum;
        }
      });
    }
    else return null;

    return <GeneratedForm
      title={`New ${this.props.staticContext.docType.docTypeName}`}
      params={params} method="post"
      formAction={`/api/documents/new_document/${
        this.props.staticContext.docType.docTypeId}`}
      successCallback={this.redirect}
    />;
  }
}

export default DocumentEditPage;
