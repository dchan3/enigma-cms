import React, { useState } from 'react';
import { object } from 'prop-types';
import { GeneratedForm } from '../../reusables';

var minMax = {
  type: (value) => (value === 'date') ? 'date' : 'number',
  attrDepends: { type: ['attributes.$.attrType'] }
};

var EditDocType = ({ match, staticContext: { docType } }) => {
  let [state, setState] = useState({
    optionParams: docType && docType.attributes && docType.attributes.length &&
      docType.attributes.map(
        ({ attrName, attrType }) => ({
          attrName, attrType
        })) || ['']
  });


  function updateParams({ attributes }) {
    setState({
      optionParams: attributes.map(({ attrName, attrType }) => ({
        attrName, attrType
      }))
    });
  }

  return <GeneratedForm currentValue={docType} title="Edit Document Type"
    params={{
      docTypeName: {
        label: 'Document Type Name',
        type: 'text',
        value: ''
      },
      docTypeNamePlural: {
        label: 'Document Type Name Plural',
        type: 'text',
        value: ''
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
          minimum: minMax,
          maximum: minMax,
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
        }
      },
      slugFrom: {
        label: 'Generate Slug From',
        type: 'enum',
        enumList: state.optionParams ?
          [{ text: '(None)', value: '' },
            state.optionParams.map(({ attrName }) => ({
              text: attrName, value: attrName
            }))].flat() : [
            { text: '(None)', value: '' }
          ],
        value: ''
      }
    }} method="post" parentCallback={updateParams} redirectUrl='/admin'
    formAction={docType ?
      `/api/documents/update_type/${match.params.docTypeId}` :
      '/api/documents/register_type'}/>;
}

EditDocType.propTypes = {
  match: object,
  staticContext: object
};

export default EditDocType;
