import mongoose from 'mongoose';

let { Schema, model } = mongoose;

const ReverseIndexSchema = new Schema({
  string: { type: String },
  where: {
    type: [Object]
  }
});

export default model('ReverseIndex', ReverseIndexSchema);
