import mongoose from 'mongoose';

let  { Schema, model } = mongoose;

const DocumentDisplayTemplateSchema = new Schema({
  docTypeId: { type: Number },
  templateBody: { type: String },
  categoryTemplateBody: { type: String }
});

export default model('DocumentDisplayTemplate', DocumentDisplayTemplateSchema);
