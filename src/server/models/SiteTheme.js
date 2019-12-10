import mongoose from 'mongoose';

let { Schema, model } = mongoose;

const SiteThemeSchema = new Schema({
  header: {
    type: String,
    required: false,
    defaultValue: ''
  },
  menuBar: {
    type: String,
    required: false,
    defaultValue: ''
  },
  menuLink: {
    type: String,
    required: false,
    defaultValue: ''
  },
  overall: {
    type: String,
    required: false,
    defaultValue: ''
  }
});

export default model('SiteTheme', SiteThemeSchema);
