import mongoose, { Schema, model } from 'mongoose';

const PrivilegeSchema = new Schema({
  docTypeId: { type: Number },
  operation: {
    type: String,
    enum: ['create', 'read_own', 'read_any', 'update_own', 'update_any',
      'delete_own', 'delete_any']
  },
  grantedRoleId: { type: Number }
});

export default model('Privilege', PrivilegeSchema);
