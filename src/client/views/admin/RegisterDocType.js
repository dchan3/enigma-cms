import React, { useState } from 'react';
import { GeneratedForm } from '../../reusables';

function RegisterDocType() {
  let [state, setState] = useState({
    optionParams: ['']
  });

  function updateParams(values) {
    setState({
      optionParams: values.attributes.map(({ attrName, attrType }) => ({
        attrName, attrType
      }))
    });
  }

  return <GeneratedForm title="Register Document Type" params={{
    docTypeName: {
      label: 'Document Type Name',
      type: 'text'
    },
    docTypeNamePlural: {
      label: 'Document Type Name Plural',
      type: 'text'
    },
    attributes: {
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
          type: (value) => (value === 'date') ? 'date' : 'number',
          attrDepends: {
            type: ['attributes.$.attrType']
          }
        },
        maximum: {
          type: (value) => (value === 'date') ? 'date' : 'number',
          attrDepends: {
            type: ['attributes.$.attrType']
          }
        },
        grammar: {
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
        state.optionParams.map(({ attrName }) => ({
          text: attrName, value: attrName
        }))].flat() || [
        { text: '(None)', value: '' }
      ]
    }
  }} method="post" parentCallback={updateParams}
  redirectUrl='/admin' formAction='/api/documents/register_type' />;
}

export default RegisterDocType;
