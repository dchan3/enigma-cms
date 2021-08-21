import fs from 'fs';

export const getFile = function (fn) {
  if (typeof fn !== 'string') {
    return;
  }

  try {
    if (!fs.exists(fn)) throw '';

    let data = fs.readFileSync(fn);
    if (!data) throw '';
    return data;
  }
  catch (e) {
    return null;
  }
};