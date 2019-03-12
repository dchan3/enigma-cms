import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GeneratedForm from '../reusables/GeneratedForm';
import axios from 'axios';
import { default as urlUtils } from '../utils';

class UpdateDocType extends Component {
  static propTypes = {
    match: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.updateParams = this.updateParams.bind(this);

    this.state = {
      docType: null,
      optionParams: null
    }
  }

  componentDidMount() {
    axios.get(urlUtils.serverInfo.path('/api/documents/get_type/' +
      this.props.match.params.docTypeId), { withCredentials: true })
      .then((res) => res.data)
      .then(data => { this.setState({ docType: data, optionParams:
        data.attributes ?
          data.attributes.map(attr => ({
            attrName: attr.attrName,
            attrType: attr.attrType
          })) : null }); })
      .catch((err) => {
        console.log(err);
        console.log('Could not get document type.');
      });
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
    if (this.state.docType !== null)
      return <GeneratedForm title="Update Document Type" params={{
        docTypeName: {
          label: 'Document Type Name',
          type: 'text',
          value: this.state.docType.docTypeName
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
            }
          },
          value: this.state.docType.attributes || []
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
          value: this.state.docType.slugFrom || ''
        }
      }} method="post" parentCallback={this.updateParams}
      formAction={urlUtils.serverInfo.path('/api/documents/update_type/' +
        this.props.match.params.docTypeId)} />;
    else return null;
  }
}

export default UpdateDocType;
