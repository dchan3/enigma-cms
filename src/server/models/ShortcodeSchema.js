import mongoose, { Schema } from 'mongoose';

const ShortcodeSchema = new Schema({
  name: { type: String },
  args: { type: [String] },
  code: { type: String }
});

export default ShortcodeSchema;
