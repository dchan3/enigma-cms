import React, { useEffect, useState } from 'react';
import { TextHeader, SamePageAnchor } from '../../reusables';
import { TablePaginator } from 'react-everafter';
import useStaticContext from '../../hooks/useStaticContext';
import { default as syncReqs } from '../../utils/api_request_async';
import { default as asyncReqs } from '../../utils/api_request_sync';
function FileMgmtLanding() {
  let { files } = useStaticContext(['files']);

  function handleDeleteClick() {
    return function(url) {
      asyncReqs.deleteRequestSync(url);
    }
  }

  let [state, setState] = useState({
    files: []
  });

  useEffect(function() {
    if (files) {
      setState({ files });
    }
    else {
      syncReqs.getRequest('files/get', (files) => {
        setState({ files })
      });
    }
  }, []);

  let { files: stateFiles } = state;

  return [
    <TextHeader>Manage Files</TextHeader>,
    <SamePageAnchor href='/admin/upload-file'>Upload File</SamePageAnchor>,
    stateFiles.length ? <TablePaginator perPage={10} activeTabColor="cadetblue"
      items={stateFiles} truncate={true} columns={[
        {
          headerText: 'File Name',
          display: ({ fileName }) => <p>{fileName}</p>
        },
        {
          headerText: 'File Type',
          display: ({ fileType }) => <p>{fileType}</p>
        },
        {
          headerText: 'Preview',
          display: ({ fileType, fileName }) => {
            if (fileType === 'image')
              return <img style={{ height: '100px', width: 'auto' }}
                src={`/uploads/${fileType}/${fileName}`} />;
            else if (fileType === 'audio')
              return <audio controls>
                <source src={`/uploads/${fileType}/${fileName}`} />
              </audio>;
            else if (fileType === 'video')
              return <video controls>
                <source src={`/uploads/${fileType}/${fileName}`} />
              </video>;
            return <a href= {`/uploads/${fileType}/${fileName}`}>
              Download</a>;
          }
        },
        {
          headerText: 'Delete',
          display: ({ fileType, _id }) =>
            <button onClick={() => handleDeleteClick()(
              `files/delete_file/${fileType}/${_id}`)}>Delete</button>
        },
        {
          headerText: 'Date Created',
          display: ({ createdDate }) => <p>{createdDate.toString()}</p>
        }
      ]} /> : null
  ];
}

export default FileMgmtLanding;
