export default function createReverseIndex(text) {
  let savedLoc = -1, map = {}, str = '';
  for (var i = 0; i < text.length; i++) {
    if (!(' ,."\':;()[]{}+=-_<>!\\/\n'.includes(text[i]))) {
      str += text[i];
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
  }
  return map;
}
