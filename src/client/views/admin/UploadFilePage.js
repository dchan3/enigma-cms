import { h } from 'preact'; /** @jsx h **/
import { GeneratedForm } from '../../reusables/back_exports';

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
  } }} formAction='files/upload_file' redirectUrl="/admin/file-mgmt" />;
