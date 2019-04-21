import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GeneratedForm from '../../reusables/GeneratedForm';

class UpdateDocType extends Component {
  static propTypes = {
    match: PropTypes.object,
    staticContext: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.updateParams = this.updateParams.bind(this);

    this.state = {
      optionParams: []
    }
  }

  updateParams(values) {
    this.setState({
      optionParams: values.attributes.map(attr => ({
        attrName: attr.attrName,
        attrType: attr.attrType
      }))
    });
  }

  render() {
    var docType = this.props.staticContext.docType;
    if (docType !== null)
      return <GeneratedForm title="Update Document Type" params={{
        docTypeName: {
          label: 'Document Type Name',
          type: 'text',
          value: docType.docTypeName
        },
        attributes: {
          label: 'Attributes',
          type: '[object]',
          shape: {
            attrName: {
              label: 'Attribute Name',
              type: 'text'
            },
            attrType: {
              label: 'Attribute Type',
              type: 'enum',
              enumList: [
                { 'text': 'Text', 'value': 'text' },
                { 'text': 'Datetime', 'value': 'date' },
                { 'text': 'Number', 'value': 'number' }
              ]
            },
            minimum: {
              label: 'Minimum',
              type: (value) => (value && value.attrType === 'date') ?
                'date' : 'number'
            },
            maximum: {
              label: 'Maximum',
              type: (value) => (value && value.attrType === 'date') ?
                'date' : 'number',
            },
            grammar: {
              label: 'Grammar',
              type: 'enum',
              enumList: [
                { text: '(None)', value: '' },
                { text: 'HTML', value: 'html' },
                { text: 'CSS', value: 'css' }
              ]
            },
            enumList: {
              label: 'Options',
              type: '[text]',
            }
          },
          value: docType.attributes || []
        },
        slugFrom: {
          label: 'Generate Slug From',
          type: 'enum',
          enumList: !!this.state.optionParams ?
            [{ text: '(None)', value: '' },
              this.state.optionParams.map(param => ({
                text: param.attrName, value: param.attrName
              }))].flat() : [
              { text: '(None)', value: '' }
            ],
          value: docType.slugFrom || ''
        }
      }} method="post" parentCallback={this.updateParams}
      redirectUrl='/admin'
      formAction={`/api/documents/update_type/${ 
        this.props.match.params.docTypeId}`} />;
    else return null;
  }
}

export default UpdateDocType;
