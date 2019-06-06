import { default as gensig } from '../../../lib/utils/gensig';

export default function({ body }, res, next) {
  let { sig } = body, tempReq = Object.assign(body, {});
  delete tempReq.sig;
  if (gensig(tempReq) === sig) {
    res.status(200);
    return next();
  }
  else return res.status(500).end();
}
