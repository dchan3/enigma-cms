import { default as gensig } from '../../../lib/utils/gensig';

export default function(req, res, next) {
  if (req.method === 'GET') return next();
  let sig = req.body.sig, tempReq = Object.assign(req.body, {});
  delete tempReq.sig;
  if (gensig(tempReq) === sig) {
    res.status(200);
    return next();
  }
  else return res.status(500).end();
}
