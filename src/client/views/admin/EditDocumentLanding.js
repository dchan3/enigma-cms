import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EverAfter from 'react-everafter';
import styled from 'styled-components';
import { TextHeader } from '../../reusables/styled';

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
  }

  render() {
    let { dataObj, config } = this.props.staticContext,
      { docType, documents } = dataObj;
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
              headerText: 'View Live',
              display: (item) => <a href={
                `/${docType.docTypeName}/${
                  config.useSlug ? item.slug : item.docNodeId}`}>View Live</a>
            }].flat()
          } />];
    else return null;
  }
}

export default EditDocumentLanding;
