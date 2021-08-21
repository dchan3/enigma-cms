import { User } from '../../../models';
import { profileMetadata } from '../../../utils/render_metadata';
import path from 'path';
import { getFile } from '../../../utils/fs_utils';

async function getAllUsers() {
  let q = await User.find({});
  return q;
}

async function getUserProfile({ username }) {
  let filename = path.join(process.env.DIRECTORY || __dirname, `profiles/${username}.enigma`), data = '', retval;
  try {
    data = getFile(filename);
    if (data) {
      retval = JSON.parse(data);
      if (!retval) throw '';
    }
  } catch {
    await User.findOne({ username }).then(async (user) => {
      if (!user) return {};
      let metadata = await profileMetadata(user);
      let { rendered } = user;
      retval = {
        metadata, rendered, username
      };
    });
  }

  return retval;
}
export default { getAllUsers, getUserProfile };
