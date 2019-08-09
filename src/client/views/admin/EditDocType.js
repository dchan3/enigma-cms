import React, { useState, useEffect, useContext } from 'react';
import { GeneratedForm } from '../../reusables';
import { get as axget } from 'axios';
import GeneralContext from '../../contexts/GeneralContext';
import StaticContext from '../../contexts/StaticContext';

let EditDocType = () => {
  let { generalState } = useContext(GeneralContext),
    { staticContext } = useContext(StaticContext),
    { match: { params: { docTypeId } } } = generalState;

  let [state, setState] = useState({
      docType: docTypeId ? (staticContext.docType && docTypeId &&
      staticContext.docType.docTypeId === parseInt(docTypeId) &&
        staticContext.docType || null) : undefined,
      optionParams: staticContext.docType && docTypeId &&
      staticContext.docType.docTypeId === parseInt(docTypeId) &&
      staticContext.docType.attributes &&
      staticContext.docType.attributes.length
      && staticContext.docType.attributes.map(
        ({ attrName, attrType }) => ({
          attrName, attrType
        })) || ['']
    }), minMax = {
      type: (value) => (value === 'date') ? 'date' : 'number',
      attrDepends: { type: ['attributes.$.attrType'] }
    };

  function updateParams({ attributes }) {
    var newState = Object.assign({}, state);
    newState.optionParams = attributes.map(({ attrName, attrType }) => ({
      attrName, attrType
    }));
    setState(newState);
  }

  useEffect(function() {
    let { docType } = staticContext;
    if (!docType || (docType && docType.docTypeId !== parseInt(docTypeId))) {
      axget(`/api/documents/get_type/${docTypeId}`).then(({ data }) => {
        setState({
          docType: data,
          optionParams: data.attributes.map(({
            attrName, attrType }) => ({
            attrName, attrType
          }))
        });
      });
    }
  }, []);

  let { docType, optionParams } = state;

  if (docType !== null) {
    return <GeneratedForm currentValue={docType} title="Edit Document Type"
      params={{
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
        } }} method="post" parentCallback={updateParams} redirectUrl='/admin'
      formAction={docTypeId ? `/api/documents/update_type/${docTypeId}`
        : '/api/documents/register_type'}/>;
  }
  return null;
};

export default EditDocType;
