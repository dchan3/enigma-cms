import sha1 from 'sha1';
import gm from 'gm';

export default function(username, cb) {
  var hash = sha1(username),
    first36 = hash.substr(0,36).split('')
      .map((digit) => parseInt(digit) % 2 === 0),
    color1 = '#' + hash.substr(-5) + '0',
    color2 = '#' + hash.substr(-5).split('').reverse().join('') + '0';

  var image = gm(64, 64, 'white');

  for (var letter in first36) {
    var row = Math.floor(letter / 6), column = letter % 6;
    console.log(row, column, color1, color2);
    image
      .stroke(first36[letter] ? color1 : color2, 10, 0)
      .fill(first36[letter] ? color1 : color2, 10)
      .drawRectangle(row * 10 + 2,  column * 10 + 2,
        (row + 1) * 10 + 2,  (column + 1) * 10 + 2);
  }

  image.resize(256, 256);

  image.toBuffer('PNG', function(err, buffer) {
    if (err) throw new Error;
    else cb('data:image/png;base64,' + Buffer.from(buffer).toString('base64'));
  });
}
