import mongoose from 'mongoose';

let { Schema, model } = mongoose;

const SiteThemeSchema = new Schema({
  header: {
    type: String,
    required: false
  },
  menuBar: {
    type: String,
    required: false
  },
  menuLink: {
    type: String,
    required: false
  },
  overall: {
    type: String,
    required: false
  }
});

export default model('SiteTheme', SiteThemeSchema);
