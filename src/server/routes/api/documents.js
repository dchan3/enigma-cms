import express from 'express';
import DocumentDisplayTemplate from '../../models/DocumentDisplayTemplate';
import DocumentType from '../../models/DocumentType';
import Document from '../../models/Document';
import slug from 'limax';

var router = express.Router();

router.get('/get_types', function(req, res) {
  DocumentType.find({ }).then(types => {
    res.status(200).json(types);
  }).catch(() => res.status(500));
});

router.get('/get_type/:id', function(req, res) {
  DocumentType.findOne({ docTypeId: req.params.id }).then(doc => {
    res.status(200).json(doc);
  }).catch(() => res.status(500));
});

router.get('/get_document/:id', function(req, res) {
  Document.findOne({ docNodeId: req.params.id }).then(doc => {
    res.status(200).json(doc);
  }).catch(() => res.status(500));
});

router.get('/get_document_by_slug/:slug', function(req, res) {
  Document.findOne({ slug: req.params.slug }).then(doc => {
    res.status(200).json(doc);
  }).catch(() => res.status(500));
});

router.get('/get_documents/:id', function(req, res) {
  Document.find({ docTypeId: req.params.id }).then(docs => {
    res.status(200).json(docs);
  }).catch(() => res.status(500));
});

router.get('/get_template/:id', function(req, res) {
  DocumentDisplayTemplate.findOne({ docTypeId: req.params.id }).then(doc => {
    res.status(200).json(doc);
  })
});

router.post('/register_type', function(req, res) {
  var newType = new DocumentType();
  var reset = [];
  for (var attr in req.body) {
    if (attr.indexOf('.') > -1) {
      var mainKey = attr.split('.')[0];
      if (!reset.includes(mainKey)) {
        newType.set(mainKey, {});
        reset.push(mainKey);
      }
    }
    newType.set(attr, req.body[attr]);
  }
  newType.save(function (err) {
    if (err) res.status(500);
    else res.redirect((process.env.CLIENT_URL || 'http://localhost:' +
  (process.env.PORT || 3000)) + '/admin/');
  });
});

router.post('/update_type/:id', function(req, res) {
  DocumentType.findOne({ docTypeId: req.params.id }).then(newType => {
    var reset = [];
    for (var attr in req.body) {
      if (attr.indexOf('.') > -1) {
        var mainKey = attr.split('.')[0];
        if (!reset.includes(mainKey)) {
          newType.set(mainKey, {});
          reset.push(mainKey);
        }
      }
      newType.set(attr, req.body[attr]);
    }
    newType.save(function (err) {
      if (err) res.status(500);
      else res.redirect((process.env.CLIENT_URL || 'http://localhost:' +
    (process.env.PORT || 3000)) + '/admin/');
    })
  })
});

router.post('/new_document/:type_id', function(req, res) {
  var newDoc = new Document({
    docTypeId: req.params.type_id,
    createdAt: new Date(),
    creatorId: req.user.userId,
    editedAt: new Date(),
    editorId: req.user.userId
  });
  var reset = [];
  for (var attr in req.body) {
    console.log(attr);
    if (attr.indexOf('.') > -1) {
      var mainKey = attr.split('.')[0];
      if (!reset.includes(mainKey)) {
        newDoc.set('content.' + mainKey, {});
        reset.push(mainKey);
      }
    }
    newDoc.set('content.' + attr, req.body[attr]);
  }
  DocumentType.findOne({ docTypeId: newDoc.docTypeId }).then(docType => {
    var propSlug = slug(newDoc.content[docType.slugFrom]);
    Document.find({ docNodeId: { $ne: req.params.node_id }, slug: {
      $regex: new RegExp('^' + propSlug)
    } }).sort({ slug: -1 }).then(documents => {
      if (documents.length > 0) {
        propSlug = slug + '-' + documents.length;
      }
      newDoc.set('slug', propSlug);
      newDoc.save(function(err) {
        if (err) res.status(500);
        else res.redirect((process.env.CLIENT_URL || 'http://localhost:' +
      (process.env.PORT || 3000)) + '/admin/');
      });
    });
  }).catch(() => { res.status(500); });
});

router.post('/update_document/:node_id', function(req, res) {
  Document.findOne({ docNodeId: req.params.node_id }).then(doc => {
    doc.set('editedAt', new Date());
    doc.set('editorId', req.user.userId);
    var reset = [];
    for (var attr in req.body) {
      if (attr.indexOf('.') > -1) {
        var mainKey = attr.split('.')[0];
        if (!reset.includes(mainKey)) {
          doc.set('content.' + mainKey, {});
          reset.push(mainKey);
        }
      }
      doc.set('content.' + attr, req.body[attr]);
    }
    DocumentType.findOne({ docTypeId: doc.docTypeId }).then(docType => {
      var propSlug = slug(doc.content[docType.slugFrom]);
      Document.find({ docNodeId: { $ne: req.params.node_id }, slug: {
        $regex: new RegExp('^' + propSlug)
      } }).sort({ slug: -1 }).then(documents => {
        if (documents.length > 0) {
          propSlug = slug + '-' + documents.length;
        }
        doc.set('slug', propSlug);
        doc.save(function(err) {
          if (err) res.status(500);
          else res.redirect((process.env.CLIENT_URL || 'http://localhost:' +
        (process.env.PORT || 3000)) + '/admin/');
        });
      });
    });
  }).catch(() => {
    res.status(500);
  });
});

router.post('/update_template/:type_id', (req, res) => {
  DocumentDisplayTemplate.findOne({ docTypeId: req.params.type_id }).then(
    doc => {
      if (doc) {
        doc.set('templateBody', req.body.templateBody);
        doc.save(function(err) {
          if (err) res.status(500);
          else res.redirect((process.env.CLIENT_URL || 'http://localhost:' +
        (process.env.PORT || 3000)) + '/admin/');
        });
      }
      else {
        var newDoc = new DocumentDisplayTemplate({
          docTypeId: req.params.type_id,
          templateBody: req.body.templateBody
        });
        newDoc.save(function(err) {
          if (err) res.status(500);
          else res.redirect((process.env.CLIENT_URL || 'http://localhost:' +
        (process.env.PORT || 3000)) + '/admin/');
        });
      }
    });
});

export default router;
