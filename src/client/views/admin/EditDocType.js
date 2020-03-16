import { h } from 'preact'; /** @jsx h **/
import { GeneratedForm } from '../../reusables/back_exports';
import { TheRedirect } from '../../the_router';
import useFrontContext from '../../hooks/useFrontContext';

export default function EditDocType({ isNew }) {
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
      },
      loaded: false
    },
    cb: function(data, fxn) {
      fxn({ dataObj: data,
        optionParams: data && data.docType && data.docType.attributes.map(
          ({ attrName, attrType }) => ({ attrName, attrType })) || [{
          attrName: '',
          attrType: ''
        }],
        loaded: true
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
  else if (dataObj === null && !isNew) return null;
  else if ((dataObj === null && isNew) || dataObj) {
    let docType = {};
    if (dataObj !== null) docType = dataObj.docType;
    return <GeneratedForm currentValue={docType}
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
        : 'register_type'}`} />;
  }
}
