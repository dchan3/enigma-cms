import mongoose, { Schema, model } from 'mongoose';
import autoIncrement, { plugin as autoIncrementPlugin } from
  'mongoose-auto-increment';
import ReverseIndex from './ReverseIndex.js';
import createReverseIndex from '../utils/create_reverse_index';
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

DocumentSchema.pre('save', async function saveHook(next) {
  const doc = this, content = doc.get('content'), { docNodeId } = doc,
    thaMap = {};

  for (let attribute in content) {
    if (attribute !== '') {
      if (typeof content[attribute] === 'string') {
        let map = createReverseIndex(content[attribute]);

        for (let str in map) {
          if (!thaMap[str]) thaMap[str] = [];
          thaMap[str].push({ attribute, columns: map[str] });
        }
      }
    }
  }

  for (let string in thaMap) {
    await ReverseIndex.findOne({ string }).then(index => {
      if (index) {
        let i = index.where.findIndex(doc => doc.docNodeId === docNodeId);
        if (i <= -1) {
          index.where.set(index.where.length, {
            docNodeId,
            locations: thaMap[string]
          });
        }
        else {
          index.where.set(i, {
            docNodeId,
            locations: thaMap[string]
          });
        }
      }
      else index = new ReverseIndex({
        string, where: [
          {
            docNodeId,
            locations: thaMap[string]
          }
        ]
      });

      index.save();
    });
  }

  return next();
});

export default model('Document', DocumentSchema);
