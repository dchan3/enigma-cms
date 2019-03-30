import sha1 from 'sha1';

export default function(obj) {
  var keys = Object.keys(obj);
  keys.sort((a,b) => a.localeCompare((b)));
  var subject = keys.map((k) => `${k}=${obj[k]}`).join('&');

  var hash = sha1(subject),
    color1 = '#' + hash.substr(-5) + '0',
    color2 = '#' + hash.substr(-5).split('').reverse().join('') + '0';

  return [color1, color2].join(' ');
}