import mongoose, { Schema } from 'mongoose';
import autoIncrement, { plugin as autoIncrementPlugin } from
  'mongoose-auto-increment';

var conn = mongoose.createConnection(
  require('../../../config/db.js').url, {}, (err) => {
    if (!err) console.log('connection successful');
    else console.error(err);
  }
);

autoIncrement.initialize(conn);

const DocumentTypeSchema = new Schema({
  docTypeId: {
    type: Number
  },
  docTypeName: {
    type: String
  },
  attributes: {
    type: [Object]
  },
  slugFrom: {
    type: String
  }
});

DocumentTypeSchema.plugin(autoIncrementPlugin,
  { model: 'DocumentType', field: 'docTypeId', startAt: 0, incrementBy: 1 });

export default mongoose.model('DocumentType', DocumentTypeSchema);
