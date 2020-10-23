import sha1 from 'sha1';
import { resolve } from 'path';
import childProcess from 'child_process';

export function buildCommand(first36, color1, color2, filename) {
  let cmd = ['magick', '-size', '64x64', 'xc:white'];
  for (let letter in first36) {
    let row = Math.floor(letter / 6), column = letter % 6,
      clr = first36[letter] ? color1 : color2;

    cmd.push('-fill', `"${clr}"`, '-stroke', `"${clr}"`, '-strokewidth', '10', '-draw',
      `"rectangle ${row * 10 + 2},${column * 10 + 2},${(row + 1) * 10 + 2},${
        (column + 1) * 10 + 2}"`);
  }
  cmd.push('-append', '-resize', '256x256', filename);
  return cmd.join(' ');
}

export default function(username, cb) {
  let hash = sha1(username),
    first36 = hash.substr(0,36).split('')
      .map((digit) => parseInt(digit) % 2 === 0), last5 = hash.substr(-5),
    color1 = `#${last5}0`, color2 = `#${last5.split('').reverse().join('')}0`;

  let filename = `/profile-pix/${username}.png`;

  childProcess.exec(buildCommand(first36, color1, color2,
    resolve(__dirname, `./public/${filename}`)), function(err) {
    console.log(err);
    if (!err) cb(filename);
  });
}
