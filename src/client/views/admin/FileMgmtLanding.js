import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextHeader } from '../../reusables/styled';
import Everafter from 'react-everafter';

class FileMgmtLanding extends Component {
  static propTypes = {
    staticContext: PropTypes.object
  }

  render() {
    let staticContext = this.props.staticContext;

    return [
      <TextHeader>Manage Files</TextHeader>,
      <a href='/admin/upload-file'>Upload File</a>,
      <Everafter.TablePaginator perPage={10}
        items={staticContext.files} truncate={true} columns={[
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
            display: (item) =>
              (item.fileType !== 'image') ?
                <a href={`/public/uploads/${item.fileName}`}>Download</a> :
                <img style={{ height: '100px', width: 'auto' }}
                  src={`/uploads/${item.fileName}`} />
          },
          {
            headerText: 'Date Created',
            display: (item) => <p>{item.createdDate}</p>
          }
        ]} />
    ];
  }
}

export default FileMgmtLanding;
