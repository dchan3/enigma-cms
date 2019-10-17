import { User, SiteConfig } from '../../../models';
import renderMarkup from '../../../utils/render_markup';
import { profileMetadata } from '../../../utils/render_metadata';

async function getAllUsers() {
  let q = await User.find({});
  return q;
}

async function getUserProfile({ username }) {
  let config = await SiteConfig.findOne({});
  let { profileTemplate } = config;
  let user = await User.findOne({ username });
  let metadata = await profileMetadata(user);
  let rendered = await renderMarkup(profileTemplate, user);
  return {
    metadata, rendered, username
  }
}

export default { getAllUsers, getUserProfile };
