import React, { Component } from 'react';
import GeneratedForm from '../reusables/GeneratedForm';

class RegisterDocType extends Component {
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
          }
        }
      }
    }} method="post"
    formAction={(process.env.SERVER_URL || 'http://localhost:' +
    (process.env.SERVER_PORT || 8080)) + '/api/documents/register_type'} />;
  }
}

export default RegisterDocType;
