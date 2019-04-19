import express from 'express';
import DocumentDisplayTemplate from '../../models/DocumentDisplayTemplate';
import DocumentType from '../../models/DocumentType';
import Document from '../../models/Document';
import slug from 'limax';
import { default as urlUtils } from '../../../lib/utils';
import { default as verifyMiddleware } from '../middleware';
import { findTheOne } from './utils';

var router = express.Router();

// GET Requests
router.get('/get_types', (req, res) => {
  DocumentType.find({ }).then(types => {
    res.status(200).json(types);
  }).catch(() => res.status(500));
});

router.get('/get_type/:id',
  findTheOne(DocumentType, { docTypeId: 'id'}));

router.get('/get_document/:id',
  findTheOne(Document, { docNodeId: 'id' }));

router.get('/get_document_by_slug/:slug',
  findTheOne(Document, { slug: 'slug' }));

router.get('/get_document_by_type_and_slug/:type/:slug', function(req, res) {
  DocumentType.findOne({
    docTypeName: req.params.type
  }).then(docType => {
    DocumentDisplayTemplate.findOne({ docTypeId: docType.docTypeId })
      .then(template => {
        Document.findOne({
          docTypeId: docType.docTypeId,
          slug: req.params.slug })
          .then(doc => {
            res.status(200).json({
              templateBody: template.templateBody,
              document: doc
            });
          })
      });
  }).catch(() => res.status(500));
});

router.get('/get_documents/:id', (req, res, next) => {
  DocumentType.findOne({
    docTypeId: parseInt(req.params.id)
  }).then(docType => {
    Document.find({ docTypeId: docType.docTypeId }).then(docs => {
      res.status(200).json({
        docType: docType,
        documents: docs
      })
    })
  }).catch(err => next(err))
});

router.get('/get_template/:id', (req, res, next) => {
  DocumentType.findOne({
    docTypeId: req.params.id
  }).then(docType => {
    DocumentDisplayTemplate.findOne({ docTypeId: docType.docTypeId })
      .then(template => {
        res.status(200).json({
          templateBody: template ? template.templateBody : '',
          docType: docType
        });
      })
  }).catch(err => next(err));
});


// POST Requests
router.post('/register_type', verifyMiddleware, (req, res, next) => {
  let newType = new DocumentType();
  let reset = [];
  for (let attr in req.body) {
    if (attr.indexOf('.') > -1) {
      let mainKey = attr.split('.')[0];
      if (!reset.includes(mainKey)) {
        newType.set(mainKey, {});
        reset.push(mainKey);
      }
    }
    newType.set(attr, req.body[attr]);
  }
  newType.save(function (err) {
    if (err) return next(err);
    else res.redirect(urlUtils.info.path('/admin/'));
  });
});

router.post('/update_type/:id', verifyMiddleware, (req, res, next) => {
  DocumentType.findOne({ docTypeId: req.params.id }).then(newType => {
    let reset = [];
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
      if (err) return next(err);
      else res.redirect(urlUtils.info.path('/admin/'));
    })
  })
});

router.post('/new_document/:type_id', verifyMiddleware, (req, res) => {
  var newDoc = new Document({
    docTypeId: req.params.type_id,
    createdAt: new Date(),
    creatorId: req.user.userId,
    editedAt: new Date(),
    editorId: req.user.userId
  });
  var reset = [];
  for (var attr in req.body) {
    if (attr.indexOf('.') > -1) {
      var mainKey = attr.split('.')[0];
      if (!reset.includes(mainKey)) {
        newDoc.set(`content.${  mainKey}`, {});
        reset.push(mainKey);
      }
    }
    newDoc.set(`content.${attr}`, req.body[attr]);
  }
  DocumentType.findOne({ docTypeId: newDoc.docTypeId }).then(docType => {
    let propSlug = slug(newDoc.content[docType.slugFrom]);
    Document.find({ docNodeId: { $ne: req.params.node_id }, slug: {
      $regex: new RegExp(`^${propSlug}`)
    } }).sort({ slug: -1 }).then(documents => {
      if (documents.length > 0) {
        propSlug = `${slug}-${documents.length}`;
      }
      newDoc.set('slug', propSlug);
      newDoc.save(function(err) {
        if (err) res.status(500);
        else res.redirect(urlUtils.info.path('/admin/'));
      });
    });
  }).catch(() => { res.status(500); });
});

router.post('/update_document/:node_id', verifyMiddleware, (req, res, next) => {
  Document.findOne({ docNodeId: req.params.node_id }).then(doc => {
    doc.set('editedAt', new Date());
    doc.set('editorId', req.user.userId);
    var reset = [];
    for (var attr in req.body) {
      if (attr.indexOf('.') > -1) {
        var mainKey = attr.split('.')[0];
        if (!reset.includes(mainKey)) {
          doc.set(`content.${mainKey}`, {});
          reset.push(mainKey);
        }
      }
      doc.set(`content.${attr}`, req.body[attr]);
    }
    DocumentType.findOne({ docTypeId: doc.docTypeId }).then(docType => {
      var propSlug = slug(doc.content[docType.slugFrom]);
      Document.find({ docNodeId: { $ne: req.params.node_id }, slug: {
        $regex: new RegExp(`^${propSlug}`)
      } }).sort({ slug: -1 }).then(documents => {
        if (documents.length > 0) {
          propSlug = `${slug}-${documents.length}`;
        }
        doc.set('slug', propSlug);
        doc.save(function(err) {
          if (err) res.status(500);
          else res.redirect(urlUtils.info.path('/admin/'));
        });
      });
    });
  }).catch((err) => {
    next(err);
  });
});

router.post('/update_template/:type_id', verifyMiddleware, (req, res, next) => {
  DocumentDisplayTemplate.findOne({ docTypeId: req.params.type_id }).then(
    doc => {
      if (doc) {
        doc.set('templateBody', req.body.templateBody);
        doc.save(function(err) {
          if (err) return next(err);
          else return res.status(200).end();
        });
      }
      else {
        var newDoc = new DocumentDisplayTemplate({
          docTypeId: req.params.type_id,
          templateBody: req.body.templateBody
        });
        newDoc.save(function(err) {
          if (err) return next(err);
          else return res.status(200).end();
        });
      }
    });
});

export default router;
