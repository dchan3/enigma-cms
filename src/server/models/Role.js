import mongoose, { Schema, model } from 'mongoose';
import autoInc from 'mongoose-sequence';

let autoIncPlugin = autoInc(mongoose);

var RoleSchema = new Schema({
  name: {
    type: String, required: true
  },
  roleId: { type: Number }
});

RoleSchema.plugin(autoIncPlugin, { inc_field: 'roleId', start_seq: 0, inc_amount: 1 });

export default model('Role', RoleSchema);
