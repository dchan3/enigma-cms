import mongoose, { Schema, model } from 'mongoose';
import autoIncrement, { plugin as autoIncrementPlugin } from
  'mongoose-auto-increment';

var conn = mongoose.createConnection(
  require('../../../config/db.js').url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, () => { });

autoIncrement.initialize(conn);

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
    required: true
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

FileSchema.plugin(autoIncrementPlugin,
  { model: 'File', field: 'fileId', startAt: 0, incrementBy: 1 });

export default model('File', FileSchema);
