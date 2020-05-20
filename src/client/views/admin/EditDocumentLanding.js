import { h } from 'preact'; /** @jsx h **/
import { TextHeader, SamePageAnchor, TablePaginator } from
  '../../reusables/back_exports';
import { TheRedirect } from '../../the_router';
import useFrontContext from '../../hooks/useFrontContext';
import { default as syncReqs } from '../../utils/api_request_sync';
import fromCss from '../../utils/component_from_css';

let TableText = fromCss('p', 'text-align:center;font-family:sans-serif;');

export default function EditDocumentLanding() {
  function handleDeleteClick() {
    return function(url) {
      syncReqs.deleteRequestSync(url);
    }
  }

  let { state } = useFrontContext({
      dataParams: ['docType.docTypeId'],
      urlParams: ['docType'],
      apiUrl: function({ docType }) {
        return `documents/get_documents/${docType}`;
      }
    }), { dataObj } = state;

  if (dataObj === undefined) return <TheRedirect to='/admin' />;
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
                `documents/delete_document/${docTypeId}/${_id}`
              )}>Delete</button>
          }, {
            headerText: 'View Live',
            display: ({ slug }) => <SamePageAnchor href={
              `/${docTypeNamePlural}/${slug}`}>View Live</SamePageAnchor>
          }].flat()} />];
    }
    else if (docType) {
      let { docTypeName, docTypeNamePlural, docTypeId } = docType;

      return [<TextHeader>{`Edit ${docTypeName}`}</TextHeader>,
        <p>No {docTypeNamePlural} created. Create one <SamePageAnchor
          href={`/admin/new/${docTypeId}`}>
        here.</SamePageAnchor></p>];
    }
  }
  return null;
}
