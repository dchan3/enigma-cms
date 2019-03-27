import React, { Component } from 'react';
import GeneratedForm from '../reusables/GeneratedForm';
import { default as urlUtils } from '../utils';

class RegisterDocType extends Component {
  constructor(props) {
    super(props);

    this.updateParams = this.updateParams.bind(this);

    this.state = {
      optionParams: ['']
    }
  }

  redirect() {
    window.location.href = '/admin';
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
    return <GeneratedForm title="Register Document Type" params={{
      docTypeName: {
        label: 'Document Type Name',
        type: 'text'
      },
      attributes: {
        label: 'Attributes',
        type: '[object]',
        shape: {
          attrName: {
            label: 'Attribute Name',
            type: 'text',
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
          enumList: {
            label: 'Options',
            type: '[text]',
          },
          minimum: {
            label: 'Minimum',
            type: (value) => (value && value.attrType === 'date') ?
              'date' : 'number'
          },
          maximum: {
            label: 'Maximum',
            type: (value) => (value && value.attrType === 'date') ?
              'date' : 'number'
          },
          grammar: {
            label: 'Grammar',
            type: 'enum',
            enumList: [
              { text: '(None)', value: '' },
              { text: 'HTML', value: 'html' },
              { text: 'CSS', value: 'css' }
            ]
          }
        }
      },
      slugFrom: {
        label: 'Generate Slug From',
        type: 'enum',
        enumList: [{ text: '(None)', value: '' },
          this.state.optionParams.map(param => ({
            text: param.attrName, value: param.attrName
          }))].flat() || [
          { text: '(None)', value: '' }
        ]
      }
    }} method="post" parentCallback={this.updateParams}
    successCallback={this.redirect}
    formAction={urlUtils.serverInfo.path('/api/documents/register_type')} />;
  }
}

export default RegisterDocType;
