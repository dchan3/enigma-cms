import { Router } from 'express';
import { ReverseIndex, Document, DocumentType } from '../../models';

var router = Router();

router.get('/:query', function({ params: {
  query
} }, res) {
  if (!query || query.length === 0) {
    return res.json({ error: 'Input query.' }).status(200).end();
  }
  let qSplit = decodeURIComponent(query.trim()).split(' ');
  ReverseIndex.find({ string: { $in:
    qSplit
  } }).then(indexes => {
    if (indexes.length && indexes.length === qSplit.length) {
      let docs = {}, output = {};
      for (let n = 0, len = indexes.length, idx = indexes[n]; n++ < len; idx = indexes[n]) {
        let { string, where } = idx;
        for (let w = 0, len = where.length, wh = where[w]; w++ < len; wh = where[w]) {
          let { docNodeId, locations } = wh
          if (!docs[docNodeId]) docs[docNodeId] = {};
          docs[docNodeId][string] = locations;
        }
      }

      Document.find({ docNodeId: {
        $in: Object.keys(docs).map(d => Number.parseInt(d, 10)) }
      }).then(
        documents => {
          DocumentType.find({
            docTypeId: {
              $in: documents.map(doc => doc.docTypeId)
            }
          }).then(types => {
            for (let d in docs) {
              let docInfo =
                documents.find(ds => ds.docNodeId === Number.parseInt(d, 10));
              output[d] = {
                results: docs[d],
                docInfo,
                typeInfo: types.find(ts => ts.docTypeId === docInfo.docTypeId)
              }
            }

            res.json(Object.keys(output) ? output : {
              error: 'Not found' }).status(200).end();
          });
        });
    }
    else res.json({ error: 'Not found' }).status(200).end();
  });
});

export default router;
