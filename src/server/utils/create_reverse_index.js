export default function createReverseIndex(text) {
  let i = 0, savedLoc = -1, map = {}, str = '';
  for (let txt of text) {
    if (!(' ,."\':;()[]{}+=-_<>!\\/\n'.includes(txt))) {
      str += txt;
      if (savedLoc == -1) {
        savedLoc = i;
      }
      if (i + 1 === text.length) {
        if (!map[str]) map[str] = [];
        map[str].push(savedLoc);
      }
    }
    else {
      if (str.length) {
        if (!map[str]) map[str] = [];
        map[str].push(savedLoc);
        savedLoc = -1;
      }
      str = '';
    }
    i++;
  }
  return map;
}
