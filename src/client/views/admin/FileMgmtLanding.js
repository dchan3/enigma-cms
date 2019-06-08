import React from 'react';
import { object } from 'prop-types';
import { TextHeader } from '../../reusables';
import { TablePaginator } from 'react-everafter';
import { delete as axdel } from 'axios';

function FileMgmtLanding({ staticContext }) {
  function handleDeleteClick() {
    return function(url) {
      axdel(url);
    }
  }

  return [
    <TextHeader>Manage Files</TextHeader>,
    <a href='/admin/upload-file'>Upload File</a>,
    staticContext.files.length > 0 ? <TablePaginator perPage={10}
      activeTabColor="cadetblue" items={staticContext.files} truncate={true}
      columns={[
        {
          headerText: 'File Name',
          display: (item) => <p>{item.fileName}</p>
        },
        {
          headerText: 'File Type',
          display: (item) => <p>{item.fileType}</p>
        },
        {
          headerText: 'Preview',
          display: (item) => {
            if (item.fileType === 'image')
              return <img style={{ height: '100px', width: 'auto' }}
                src={`/uploads/${item.fileType}/${item.fileName}`} />;
            else if (item.fileType === 'audio')
              return <audio controls>
                <source src={`/uploads/${item.fileType}/${item.fileName}`} />
              </audio>;
            else if (item.fileType === 'video')
              return <video controls>
                <source src={`/uploads/${item.fileType}/${item.fileName}`} />
              </video>;
            return <a href= {`/uploads/${item.fileType}/${item.fileName}`}>
              Download</a>;
          }
        },
        {
          headerText: 'Delete',
          display: (item) =>
            <button onClick={() => handleDeleteClick()(
              `/api/files/delete_file/${item.fileType}/${item._id}`
            )}>Delete</button>
        },
        {
          headerText: 'Date Created',
          display: (item) => <p>{item.createdDate.toString()}</p>
        }
      ]} /> : null
  ];
}

FileMgmtLanding.propTypes = {
  staticContext: object
};

export default FileMgmtLanding;
