import mongoose from 'mongoose';

const ShortcodeSchema = new mongoose.Schema({
  name: {
    type: String
  },
  args: {
    type: [String]
  },
  code: {
    type: String
  }
});

export default ShortcodeSchema;
