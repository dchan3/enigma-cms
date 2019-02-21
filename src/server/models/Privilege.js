import mongoose, { Schema, model } from 'mongoose';

const PrivilegeSchema = new Schema({
  docType: {
    type: Number
  },
  operation: {
    type: String,
    enum: ['create', 'read_own', 'read_any',
      'update_own', 'update_any', 'delete_own', 'delete_any']
  },
  grantedRoles: {
    type: [Number]
  }
});

export default model('Privilege', PrivilegeSchema);
