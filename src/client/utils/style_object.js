function camel(str) {
  return str.split('-').map((word, i) => i ?
    (word[0].toUpperCase() + word.substring(1)) : word).join('');
}

export default function styleObject(css) {
  let retval = {},
    tr = stmt => stmt.trim(), sp = (s, c) => s.split(c).map(tr),
    statements = sp(css, ';');
  for (let statement of statements) {
    let [attr, val] = sp(statement, ':');
    if (attr.length) retval[camel(attr)]
            = val.match(/^\d+$/) ? parseInt(val, 10) : val;
  }
  return retval;
}