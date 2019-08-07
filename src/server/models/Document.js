import mongoose, { Schema, model } from 'mongoose';
import autoIncrement, { plugin as autoIncrementPlugin } from
  'mongoose-auto-increment';

var conn = mongoose.createConnection(
  require('../../../config/db.js').url, {}, () => { });

autoIncrement.initialize(conn);

const DocumentSchema = new Schema({
  docTypeId: { type: Number },
  docNodeId: { type: Number },
  creatorId: { type: Number },
  createdAt: { type: Date },
  editorId: { type: Number },
  editedAt: { type: Date },
  content: { type: Object },
  slug: { type: String },
  draft: { type: Boolean },
  rendered: { type: String }
});

DocumentSchema.plugin(autoIncrementPlugin,
  { model: 'Document', field: 'docNodeId', startAt: 0, incrementBy: 1 });

export default model('Document', DocumentSchema);
