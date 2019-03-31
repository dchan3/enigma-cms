export default function(str) {
  let retval = str.replace(/[A-Z]/g, ' $&');
  retval = retval[0].toUpperCase() + retval.substr(1);
  return retval;
}