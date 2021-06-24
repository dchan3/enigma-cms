import mongoose, { Schema, model } from 'mongoose';
import autoInc from 'mongoose-sequence';

let autoIncPlugin = autoInc(mongoose);

const FileSchema = new Schema({
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true,
    enum: ['image', 'audio', 'video', 'other']
  },
  fileId: {
    type: Number,
    required: true,
    default: -1
  },
  uploadedBy: {
    type: Number,
    required: true
  },
  createdDate: {
    type: Date,
    required: true
  },
  modifiedDate: {
    type: Date,
    required: true
  },
  additionalInfo: {
    type: Object,
    required: false
  }
});

FileSchema.plugin(autoIncPlugin, { inc_field: 'fileId', start_seq: 0, inc_amount: 1 });

export default model('File', FileSchema);
