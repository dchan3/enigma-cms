import mongoose, { Schema, model } from 'mongoose';
import autoIncrement, { plugin as autoIncrementPlugin } from
  'mongoose-auto-increment';

var conn =
  mongoose.createConnection(require('../../../config/db.js').url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, () => {});

autoIncrement.initialize(conn);

var RoleSchema = new Schema({
  name: {
    type: String, required: true
  },
  roleId: { type: Number }
});

RoleSchema.plugin(autoIncrementPlugin,
  { model: 'Role', field: 'roleId', startAt: 0, incrementBy: 1 });

export default model('Role', RoleSchema);
