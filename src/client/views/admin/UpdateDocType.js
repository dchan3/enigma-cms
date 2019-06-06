import React, { useState } from 'react';
import PropTypes from 'prop-types';
import GeneratedForm from '../../reusables/GeneratedForm';

function UpdateDocType({ match, staticContext }) {
  let [state, setState] = useState({
    optionParams: staticContext.docType &&
      staticContext.docType.attributes &&
      staticContext.docType.attributes.length &&
      staticContext.docType.attributes.map(
        ({ attrName, attrType }) => ({
          attrName, attrType
        })) || []
  });


  function updateParams(values) {
    setState({
      optionParams: values.attributes.map(({ attrName, attrType }) => ({
        attrName, attrType
      }))
    });
  }

  let { docType } = staticContext;
  if (docType !== null) {
    let { docTypeName, docTypeNamePlural } = docType;
    return <GeneratedForm title="Update Document Type" params={{
      docTypeName: {
        label: 'Document Type Name',
        type: 'text',
        value: docTypeName
      },
      docTypeNamePlural: {
        label: 'Document Type Name Plural',
        type: 'text',
        value: docTypeNamePlural || ''
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
        enumList: !!state.optionParams ?
          [{ text: '(None)', value: '' },
            state.optionParams.map(param => ({
              text: param.attrName, value: param.attrName
            }))].flat() : [
            { text: '(None)', value: '' }
          ],
        value: docType.slugFrom || ''
      }
    }} method="post" parentCallback={updateParams} redirectUrl='/admin'
    formAction={`/api/documents/update_type/${match.params.docTypeId}`} />;
  }
  else return null;
}

UpdateDocType.propTypes = {
  match: PropTypes.object,
  staticContext: PropTypes.object
};

export default UpdateDocType;
