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

  render() {
    let params = {}, { docType } = this.props.staticContext;
    if (docType) {
      docType.attributes.forEach(attr => {
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

      params.draft = {
        type: 'enum',
        enumList: [{
          text: 'Yes', value: true }, {
          text: 'No', value: false
        }]
      };
    }
    else return null;

    return <GeneratedForm
      title={`New ${this.props.staticContext.docType.docTypeName}`}
      params={params} method="post"
      formAction={`/api/documents/new_document/${
        this.props.staticContext.docType.docTypeId}`}
      redirectUrl={`/admin/edit/${this.props.staticContext.docType.docTypeId}`}
    />;
  }
}

export default DocumentEditPage;
