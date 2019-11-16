import { File } from '../../../models';

async function getAllFiles() {
  let q = await File.find({});
  return q;
}

export default { getAllFiles };
