export const findTheOne = (collection, paramsList) => {
  return function(req, res, next) {
    let query = {};
    for (let i in paramsList) {
      if (i.length) {
        query[i] = req.params[paramsList[i]];
      }
    }
    collection.findOne(query).then(result => {
      res.status(200).json(result);
    }).catch((err) => next(err));
  };
};

export const updateMongoDoc = (body, mongoDoc, cb, { prefix = "", exceptions = [], ignore = []}) => {
  var reset = [];
  for (var attr in body) {
    if (!ignore.includes(attr)) {
      let truePrefix = (prefix.length && !exceptions.includes(attr)) ? prefix : "";
      if (attr.indexOf('.') > -1) {
        var mainKey = attr.split('.')[0];
        if (!reset.includes(mainKey)) {
          mongoDoc.set(truePrefix + mainKey, attr.match(/\.\d+/) ? [] : {});
          reset.push(mainKey);
        }
      }
      mongoDoc.set(truePrefix + attr, body[attr]);
    }
  }

  mongoDoc.save(cb);
}