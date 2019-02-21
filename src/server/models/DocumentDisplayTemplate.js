import mongoose, { model, Schema } from 'mongoose';

const DocumentDisplayTemplateSchema = new Schema({
  docTypeId: {
    type: Number
  },
  templateBody: {
    type: String
  }
});

export default model('DocumentDisplayTemplate', DocumentDisplayTemplateSchema);
