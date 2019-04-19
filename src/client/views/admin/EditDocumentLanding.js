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
    let staticContext = this.props.staticContext;
    if (staticContext.dataObj !== undefined &&
      staticContext.dataObj.docType !== null &&
      staticContext.dataObj.documents.length > 0)
      return [
        <TextHeader>
          {`Edit ${staticContext.dataObj.docType.docTypeName}`}
        </TextHeader>,
        <EverAfter.TablePaginator perPage={10}
          items={staticContext.dataObj.documents} truncate={true} columns={
            [staticContext.dataObj.docType.attributes.map(function(attr) {
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
                `/${staticContext.dataObj.docType.docTypeName}/${
                  staticContext.config.useSlug ? item.slug :
                    item.docNodeId}`}>View Live</a>
            }].flat()
          } />];
    else return null;
  }
}

export default EditDocumentLanding;
