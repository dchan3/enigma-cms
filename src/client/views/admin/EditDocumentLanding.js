import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EverAfter from 'react-everafter';
import styled from 'styled-components';
import { TextHeader } from '../../reusables/styled';
import axios from 'axios';

let TableText = styled.p`
  text-align: center;
  font-family: sans-serif;
`;

class EditDocumentLanding extends Component {
  static propTypes = {
    match: PropTypes.object,
    staticContext: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  handleDeleteClick() {
    return function(url) {
      axios.delete(url);
    }
  }

  render() {
    let { dataObj } = this.props.staticContext,
      { docType, documents } = dataObj,
      handleDeleteClick = this.handleDeleteClick;
    if (docType && documents.length > 0)
      return [
        <TextHeader>
          {`Edit ${docType.docTypeName}`}
        </TextHeader>,
        <EverAfter.TablePaginator perPage={10}
          items={documents} truncate={true} columns={
            [docType.attributes.map(function(attr) {
              return {
                headerText: attr.attrName,
                display: (item) => (
                  <TableText>{item.content[attr.attrName]}</TableText>)
              };
            }),
            {
              headerText: 'Edit',
              display: (item) =>
                <a href={`/admin/edit-document/${item.docNodeId}`}>Edit</a>
            }, {
              headerText: 'Delete',
              display: (item) =>
                <button onClick={() => handleDeleteClick()(
                  `/api/documents/delete_document/${item.docTypeId}/${item._id}`
                )}>Delete</button>
            }, {
              headerText: 'View Live',
              display: (item) => <a href={
                `/${docType.docTypeNamePlural}/${item.slug}`}>View Live</a>
            }].flat()
          } />];
    else return null;
  }
}

export default EditDocumentLanding;
