export const findTheOne = (collection, paramsList) => {
  return function(req, res, next) {
    let query = {};
    for (let i in paramsList) {
      query[i] = req.params[paramsList[i]];
    }
    collection.findOne(query).then(result => {
      res.status(200).json(result);
    }).catch(err => next(err));
  };
};
