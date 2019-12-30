import React from 'react';
import { GeneratedForm, AdminFrame } from '../../reusables';
import TheRedirect from '../../the_router/TheRedirect';
import useFrontContext from '../../hooks/useFrontContext';

let EditDocType = () => {
  let { state, setState } = useFrontContext({
    dataParams: ['docType.docTypeId'],
    urlParams: ['docTypeId'],
    apiUrl: function(params) {
      if (params && params.docTypeId)
        return `documents/get_type_2/${params.docTypeId}`
      else return '';
    },
    initial: {
      dataObj: {
        docType: {},
        optionParams: [{
          attrName: '',
          attrType: ''
        }]
      }
    },
    cb: function(data, fxn) {
      fxn({ dataObj: data,
        optionParams: data && data.docType && data.docType.attributes.map(
          ({ attrName, attrType }) => ({ attrName, attrType })) || [{
          attrName: '',
          attrType: ''
        }]
      });
    }
  });

  let minMax = {
    type: (value) => (value === 'date') ? 'date' : 'number',
    attrDepends: { type: ['attributes.$.attrType'] }
  }

  function updateParams({ attributes }) {
    var newState = Object.assign({}, state);
    newState.optionParams = attributes.map(({ attrName, attrType }) => ({
      attrName, attrType
    }));
    setState(newState);
  }

  let { dataObj, optionParams } = state;

  if (dataObj === undefined) return <TheRedirect to="/admin" />;
  else if (dataObj === null) return null;
  else {
    let { docType } = dataObj || {};
    return <AdminFrame><GeneratedForm currentValue={docType}
      title="Edit Document Type" params={{
        docTypeName: {
          label: 'Document Type Name',
          type: 'text',
          required: true
        },
        docTypeNamePlural: {
          label: 'Document Type Name Plural',
          type: 'text',
          required: true
        },
        attributes: {
          label: 'Attributes',
          type: '[object]',
          shape: {
            attrName: {
              label: 'Attribute Name',
              type: 'text',
              required: true
            },
            attrType: {
              label: 'Attribute Type',
              type: 'enum',
              enumList: [
                { 'text': 'Text', 'value': 'text' },
                { 'text': 'Datetime', 'value': 'date' },
                { 'text': 'Select', 'value': 'enum' },
                { 'text': 'Number', 'value': 'number' },
                { 'text': 'Email', 'value': 'email' },
                { 'text': 'URL', 'value': 'url' },
                { 'text': 'Color', 'value': 'color' }
              ]
            },
            repeatable: {
              type: 'enum',
              enumList: [
                { 'text': 'No', 'value': false },
                { 'text': 'Yes', 'value': true }
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
          enumList: optionParams ?
            [{ text: '(None)', value: '' },
              optionParams.map(({ attrName }) => ({
                text: attrName, value: attrName
              }))].flat() : [
              { text: '(None)', value: '' }
            ],
          value: ''
        } }} parentCallback={updateParams} redirectUrl='/admin'
      formAction={`documents/${(docType && docType.docTypeId) ?
        `update_type/${docType.docTypeId}`
        : 'register_type'}`} /></AdminFrame>;
  }
};

export default EditDocType;
