import mongoose from 'mongoose';
import Document from './Document';
let  { Schema, model } = mongoose;

const DocumentDisplayTemplateSchema = new Schema({
  docTypeId: { type: Number },
  templateBody: { type: String },
  categoryTemplateBody: { type: String }
});

DocumentDisplayTemplateSchema.post('save', function(next) {
  var { docTypeId } = this;
  Document.find({ docTypeId }).then(docs => {
    docs.forEach(doc => {
      doc.save();
    });
    if (typeof next === 'function') return next();
    else return;
  });
});

export default model('DocumentDisplayTemplate', DocumentDisplayTemplateSchema);
