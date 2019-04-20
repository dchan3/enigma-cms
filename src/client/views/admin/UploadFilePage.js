import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GeneratedForm from '../../reusables/GeneratedForm';
import { default as urlUtils } from '../../../lib/utils';

class UploadFilePage extends Component {
  static propTypes = {
    staticContext: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  redirect() {
    window.location.href = '/admin/file-mgmt';
  }

  render() {
    return <GeneratedForm
      title={'Upload File'}
      params={
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
      } method="post" formAction={urlUtils.info.path('/api/files/upload_file')}
      successCallback={this.redirect}
    />;
  }
}

export default UploadFilePage;
