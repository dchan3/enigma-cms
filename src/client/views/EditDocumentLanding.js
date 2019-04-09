import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import EverAfter from 'react-everafter';
import styled from 'styled-components';
import { default as urlUtils } from '../../lib/utils';
import { TextHeader } from '../reusables/styled';

let TableText = styled.p`
  text-align: center;
  font-family: sans-serif;
`;

class EditDocumentLanding extends Component {
  static propTypes = {
    match: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      documents: [],
      docType: null
    }
  }

  componentDidMount() {
    axios.get(urlUtils.info.path(
      `/api/documents/get_type/${this.props.match.params.docType}`),
    { withCredentials: true })
      .then((res) => res.data)
      .then(data => { this.setState({ docType: data }) })
      .catch((err) => {
        console.log(err);
        console.log('Could not get document type');
      });

    axios.get(urlUtils.info.path(
      `/api/documents/get_documents/${
        this.props.match.params.docType}`), { withCredentials: true })
      .then((res) => res.data)
      .then(data => { this.setState({ documents: data }) })
      .catch((err) => {
        console.log(err);
        console.log('Could not get documents');
      });
  }

  render() {
    if (this.state.docType !== null && this.state.documents.length > 0)
      return [
        <TextHeader>{`Edit ${this.state.docType.docTypeName}`}</TextHeader>,
        <EverAfter.TablePaginator perPage={10}
          items={this.state.documents} truncate={true} columns={
            [this.state.docType.attributes.map(function(attr) {
              return {
                headerText: attr.attrName,
                display: (item) => (
                  <TableText>{item.content[attr.attrName]}</TableText>)
              };
            }),
            {
              headerText: 'Edit',
              display: (item) =>
                <a href={`/admin/edit_document/${item.docNodeId}`}>Edit</a>
            }, {
              headerText: 'View Live',
              display: (item) => <a href={`/page/${
                this.props.staticContext.config.useSlug ? item.slug :
                  item.docNodeId}`}>View Live</a>
            }].flat()
          } />];
    else return null;
  }
}

export default EditDocumentLanding;
