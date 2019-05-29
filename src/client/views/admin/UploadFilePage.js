import React, { Component } from 'react';
import { object } from 'prop-types';
import { GeneratedForm } from '../../reusables';

class UploadFilePage extends Component {
  static propTypes = {
    staticContext: object
  };

  constructor(props) {
    super(props);
  }

  render() {
    return <GeneratedForm
      title={'Upload File'} params={
        {
          fileToUpload: {
            type: 'file'
          },
          fileContent: {
            type: 'string',
            hidden: true
          },
          fileType: {
            type: 'enum',
            enumList: [{
              text: 'Image', value: 'image' }, {
              text: 'Audio', value: 'audio' }, {
              text: 'Video', value: 'video' }, {
              text: 'Other', value: 'other' }],
          }
        }
      } method="post" formAction='/api/files/upload_file'
      redirectUrl="/admin/file-mgmt"
    />;
  }
}

export default UploadFilePage;
