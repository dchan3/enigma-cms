import mongoose, { Schema, model } from 'mongoose';
import autoInc from 'mongoose-sequence';

let autoIncPlugin = autoInc(mongoose);

const DocumentTypeSchema = new Schema({
  docTypeId: { type: Number },
  docTypeName: { type: String },
  docTypeNamePlural: { type: String },
  attributes: { type: [Object] },
  slugFrom: { type: String },
  rendered: { type: String }
});

DocumentTypeSchema.plugin(autoIncPlugin, { inc_field: 'docTypeId', start_seq: 0, inc_amount: 1 });

export default model('DocumentType', DocumentTypeSchema);
