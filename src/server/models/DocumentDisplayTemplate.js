import mongoose from 'mongoose';

const DocumentDisplayTemplateSchema = new mongoose.Schema({
  docTypeId: {
    type: Number
  },
  templateBody: {
    type: String
  },
  categoryTemplateBody: {
    type: String
  }
});

export default
mongoose.model('DocumentDisplayTemplate', DocumentDisplayTemplateSchema);
