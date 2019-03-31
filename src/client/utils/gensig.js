import sha1 from 'sha1';

export default function(obj) {
  let keys = Object.keys(obj);
  keys.sort((a,b) => a.localeCompare((b)));
  let subject = keys.map((k) => `${k}=${obj[k]}`).join('&');

  let hash = sha1(subject),
    color1 = `#${hash.substr(-5)}0`,
    color2 = `#${hash.substr(-5).split('').reverse().join('')}0`;

  return [color1, color2].join(' ');
}