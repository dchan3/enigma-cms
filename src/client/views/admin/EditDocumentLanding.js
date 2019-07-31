import React, { useEffect, useState, useContext } from 'react';
import { TablePaginator } from 'react-everafter';
import styled from 'styled-components';
import { TextHeader, SamePageAnchor } from '../../reusables';
import { Redirect } from 'react-router-dom';
import { get as axget, delete as axdel } from 'axios';
import GeneralContext from '../../contexts/GeneralContext';

let TableText = styled.p`text-align:center;font-family:sans-serif;`;

function EditDocumentLanding() {
  let { generalState } = useContext(GeneralContext), { staticContext, match: {
    params: { docType: docTypeId } } } = generalState;

  let [state, setState] = useState({
    dataObj: staticContext.dataObj && docTypeId &&
      staticContext.dataObj.docType &&
      staticContext.dataObj.docType.docTypeId === parseInt(docTypeId) &&
      staticContext.dataObj.documents &&
      staticContext.dataObj || null
  });

  useEffect(function() {
    let { dataObj } = state;
    if (!dataObj) {
      axget(`/api/documents/get_documents/${docTypeId}`).then(({ data }) => {
        setState({ dataObj: data })
      });
    }
  }, []);

  function handleDeleteClick() {
    return function(url) {
      axdel(url).then(function() {
        axget(`/api/documents/get_documents/${docTypeId}`).then(({ data }) => {
          setState({ dataObj: data })
        });
      });
    }
  }

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
