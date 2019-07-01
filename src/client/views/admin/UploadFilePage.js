import React from 'react';
import { GeneratedForm } from '../../reusables';

export default () => <GeneratedForm title='Upload File' params={{
  fileToUpload: { type: 'file' },
  fileContent: { type: 'string', hidden: true },
  fileType: {
    type: 'enum',
    enumList: [{
      text: 'Image', value: 'image' }, {
      text: 'Audio', value: 'audio' }, {
      text: 'Video', value: 'video' }, {
      text: 'Other', value: 'other' }],
  } }} method="post" formAction='/api/files/upload_file' redirectUrl=
  "/admin/file-mgmt"
/>;
