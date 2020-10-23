import { default as gensig } from '../../../lib/utils/gensig';

export default function(req, res, next) {
  let { body } = req, { sig } = body, tempReq = Object.assign(body, {});
  delete tempReq.sig;
  if (gensig(tempReq) === sig) {
    res.status(200);
    return next();
  }
  else return res.status(500).end();
}
