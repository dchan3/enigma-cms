import React, { useEffect } from 'react';
import { TablePaginator } from 'react-everafter';
import styled from 'styled-components';
import { TextHeader, SamePageAnchor } from '../../reusables';
import { Redirect } from 'react-router-dom';
import { delete as axdel } from 'axios';
import useFrontContext from '../../hooks/useFrontContext';
import { get as axget } from 'axios';

let TableText = styled.p`text-align:center;font-family:sans-serif;`;

function EditDocumentLanding() {
  let { state, setState, apiUrl } = useFrontContext({
    dataParams: ['docType.docTypeId'],
    urlParams: ['docType'],
    apiUrl: function({ docType }) {
      return `/api/documents/get_documents/${docType}`;
    }
  });

  function handleDeleteClick() {
    return function(url) {
      axdel(url);
    }
  }

  useEffect(function() {
    axget(apiUrl).then(({ data }) => setState({ dataObj: data }));
  }, []);

  let { dataObj } = state;

  if (dataObj === undefined) return <Redirect to='/admin' />;
  else if (dataObj) {
    let { docType, documents } = dataObj;

    if (docType && documents && documents.length) {
      let { docTypeName, docTypeNamePlural, attributes } = docType;
      return [<TextHeader>{`Edit ${docTypeName}`}</TextHeader>,
        <TablePaginator perPage={10} activeTabColor="cadetblue"
          items={documents} truncate={true} columns={[attributes.map(({
            attrName }) => ({
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
              <SamePageAnchor href={`/admin/edit-document/${docNodeId}`}>Edit
              </SamePageAnchor>
          }, {
            headerText: 'Delete',
            display: ({ docTypeId, _id }) =>
              <button onClick={() => handleDeleteClick()(
                `/api/documents/delete_document/${docTypeId}/${_id}`
              )}>Delete</button>
          }, {
            headerText: 'View Live',
            display: ({ slug }) => <SamePageAnchor href={
              `/${docTypeNamePlural}/${slug}`}>View Live</SamePageAnchor>
          }].flat()} />];
    }
  }
  return null;
}

export default EditDocumentLanding;
