export default function(str) {
  var retval = str.replace(/[A-Z]/g, ' $&');
  retval = retval[0].toUpperCase() + retval.substr(1);
  return retval;
}