function camel(str) {
  return str.split('-').map((word, i) => i > 0 ?
    (word[0].toUpperCase() + word.substring(1)) : word).join('');
}

export default function styleObject(css) {
  let retval = {}, statements = css.split(';').map(stmt => stmt.trim());
  for (let s = 0; s < statements.length; s++) {
    let [attr, val] = statements[s].split(':').map(stmt => stmt.trim());
    if (attr.length) retval[camel(attr)]
      = val.match(/^\d+$/) ? parseInt(val,10) : val;
  }
  return retval;
}