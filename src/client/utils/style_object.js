function camel(str) {
  return str.split('-').map((word, i) => i ?
    (word[0].toUpperCase() + word.substring(1)) : word).join('');
}

export default function styleObject(css) {
  let retval = {},
    tr = stmt => stmt.trim(), sp = (s, c) => s.split(c).map(tr),
    statements = sp(css, ';');
  for (let s = 0; s < statements.length; s++) {
    let [attr, val] = sp(statements[s], ':');
    if (attr.length) retval[camel(attr)]
      = val.match(/^\d+$/) ? parseInt(val,10) : val;
  }
  return retval;
}
