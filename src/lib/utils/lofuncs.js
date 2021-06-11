export const loget = function(obj, keyString) {
  try {
    var keys = keyString.split('.');

    if (!keys || keys.length <= 1) {
      return obj[keyString];
    }
    else if (keys) {
      return loget(obj[keys[0]], keyString.substring(keyString.indexOf('.') + 1));
    }
  }
  catch (e) {
    return undefined;
  }
};

export const loset = function(obj, keyString, val) {
  var keys = keyString.split('.');
  if (keys.length <= 1) {
    obj[keyString] = val;
  }
  else {
    loset(obj[keys[0]], keyString.substring(keyString.indexOf('.') + 1), val);
  }
};

export const objMap = function(obj, func) {
  return Object.keys(obj).map(func.bind(obj));
};
