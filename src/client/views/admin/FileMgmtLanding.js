import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextHeader } from '../../reusables/styled';
import Everafter from 'react-everafter';

class FileMgmtLanding extends Component {
  static propTypes = {
    staticContext: PropTypes.object
  };

  render() {
    let staticContext = this.props.staticContext;

    return [
      <TextHeader>Manage Files</TextHeader>,
      <a href='/admin/upload-file'>Upload File</a>,
      staticContext.files.length > 0 ? <Everafter.TablePaginator perPage={10}
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
            headerText: 'Date Created',
            display: (item) => <p>{item.createdDate.toString()}</p>
          }
        ]} /> : null
    ];
  }
}

export default FileMgmtLanding;
