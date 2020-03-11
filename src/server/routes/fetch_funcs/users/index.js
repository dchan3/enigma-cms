import { User } from '../../../models';
import { profileMetadata } from '../../../utils/render_metadata';

async function getAllUsers() {
  let q = await User.find({});
  return q;
}

async function getUserProfile({ username }) {
  return User.findOne({ username }).then(async user => {
    if (!user) return {};
    let metadata = await profileMetadata(user);
    let { rendered } = user;
    return {
      metadata, rendered, username
    }
  });
}
export default { getAllUsers, getUserProfile };
