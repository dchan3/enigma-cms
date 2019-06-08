import React from 'react';
import { object } from 'prop-types';
import { TablePaginator } from 'react-everafter';
import styled from 'styled-components';
import { TextHeader } from '../../reusables';
import { delete as axdel } from 'axios';

let TableText = styled.p`text-align:center;font-family:sans-serif;`;

function EditDocumentLanding({ staticContext: {
  dataObj: { docType, documents }
} }) {
  function handleDeleteClick() {
    return function(url) {
      axdel(url);
    }
  }

  if (docType && documents.length > 0) {
    var { docTypeName, docTypeNamePlural, attributes } = docType;
    return [
      <TextHeader>
        {`Edit ${docTypeName}`}
      </TextHeader>,
      <TablePaginator perPage={10} activeTabColor="cadetblue" items={documents}
        truncate={true} columns={[attributes.map(({ attrName }) => ({
          headerText: attrName,
          display: ({ content }) => (
            <TableText>{content[attrName]}</TableText>)
        })),
        {
          headerText: 'Draft',
          display: ({ draft }) => <p>{draft ? 'Yes' : 'No'}</p>
        },
        {
          headerText: 'Edit',
          display: ({ docNodeId }) =>
            <a href={`/admin/edit-document/${docNodeId}`}>Edit</a>
        }, {
          headerText: 'Delete',
          display: ({ docTypeId, _id }) =>
            <button onClick={() => handleDeleteClick()(
              `/api/documents/delete_document/${docTypeId}/${_id}`
            )}>Delete</button>
        }, {
          headerText: 'View Live',
          display: ({ slug }) => <a href={
            `/${docTypeNamePlural}/${slug}`}>View Live</a>
        }].flat()
        } />];
  }
  else return null;
}

EditDocumentLanding.propTypes = {
  match: object,
  staticContext: object
};

export default EditDocumentLanding;
