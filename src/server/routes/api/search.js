import { Router } from 'express';
import { ReverseIndex, Document, DocumentType } from '../../models';

var router = Router();

router.get('/:query', function({ params: {
  query
} }, res) {
  let qSplit = decodeURIComponent(query.trim()).split(' ')
  ReverseIndex.find({ string: { $in:
    qSplit
  } }).then(indexes => {
    if (indexes.length && indexes.length === qSplit.length) {
      let docs = {}, output = {};
      for (let n = 0; n < indexes.length; n++) {
        let { string, where }  = indexes[n];
        for (let w = 0; w < where.length; w++) {
          let { docNodeId, locations } = where[w];
          if (!docs[docNodeId]) docs[docNodeId] = {};
          docs[docNodeId][string] = locations;
        }
      }

      for (let d in docs) {
        if (Object.keys(docs[d]).length !== indexes.length) {
          delete docs[d];
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
              let docInfo = documents.find(ds => ds.docNodeId === parseInt(d));
              output[d] = {
                results: docs[d],
                docInfo,
                typeInfo: types.find(ts => ts.docTypeId === docInfo.docTypeId)
              }
            }

            res[Object.keys(output) ? 'json' : 'send'](
              Object.keys(output) ? output : 'Not found').status(200).end();
          })
        });
    }
    else res.send('Not found').status(200).end();
  });
});

export default router;
