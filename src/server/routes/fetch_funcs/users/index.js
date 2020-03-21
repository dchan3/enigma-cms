import { User } from '../../../models';
import { profileMetadata } from '../../../utils/render_metadata';
import fs from 'fs';
import path from 'path';

async function getAllUsers() {
  let q = await User.find({});
  return q;
}

async function getUserProfile({ username }) {
  let filename = path.join(__dirname, `profiles/${username}.enigma`), data = '', retval;
  try {
    if (!fs.exists(filename)) throw '';

    data = fs.readFileSync(filename);
    if (!data) throw '';

    retval = JSON.parse(data);
    if (!retval) throw '';
  } catch {
    await User.findOne({ username }).then(async user => {
      if (!user) return {};
      let metadata = await profileMetadata(user);
      let { rendered } = user;
      retval = {
        metadata, rendered
      }
    });
  }

  return retval;
}
export default { getAllUsers, getUserProfile };
