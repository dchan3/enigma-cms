import express from 'express';
import DocumentDisplayTemplate from '../../models/DocumentDisplayTemplate';
import DocumentType from '../../models/DocumentType';
import Document from '../../models/Document';
import slug from 'limax';
import { default as verifyMiddleware } from '../middleware';
import { ObjectId } from 'mongodb';

var router = express.Router();

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
    else {
      let newTemplate = new
      DocumentDisplayTemplate({
        docTypeId: newType.get('docTypeId'),
        templateBody: '',
        categoryTemplateBody: ''
      });
      newTemplate.save(era => {
        if (era) return next(era);
        else return res.redirect('/admin/');
      });
    }
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
      else res.redirect('/admin/');
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
    if (attr !== 'draft') {
      if (attr.indexOf('.') > -1) {
        var mainKey = attr.split('.')[0];
        if (!reset.includes(mainKey)) {
          newDoc.set(`content.${  mainKey}`, {});
          reset.push(mainKey);
        }
      }
      newDoc.set(`content.${attr}`, req.body[attr]);
    }
    else { newDoc.set(attr, req.body[attr]); }
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
        else res.redirect('/admin/');
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
      if (attr !== 'draft') {
        if (attr.indexOf('.') > -1) {
          var mainKey = attr.split('.')[0];
          if (!reset.includes(mainKey)) {
            doc.set(`content.${mainKey}`, {});
            reset.push(mainKey);
          }
        }
        doc.set(`content.${attr}`, req.body[attr]);
      }
      else { doc.set(attr, req.body[attr]); }
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
          else res.redirect('/admin/');
        });
      });
    });
  }).catch((err) => {
    next(err);
  });
});

router.delete('/delete_document/:docType/:id', (req, res, next) => {
  if (req.user) return Document.findOneAndDelete({
    _id: ObjectId(req.params.id), docTypeId: req.params.docType
  }).then(
    () => res.redirect(`/admin/edit/${req.params.docType}`))
    .catch(err => next(err));
  else
    return res.status(500).redirect('/login').end();
});

router.post('/update_template/:type_id', verifyMiddleware, (req, res, next) => {
  DocumentDisplayTemplate.findOne({ docTypeId: req.params.type_id }).then(
    doc => {
      if (doc) {
        doc.set('templateBody', req.body.templateBody);
        doc.set('categoryTemplateBody', req.body.categoryTemplateBody);
        doc.save(function(err) {
          if (err) return next(err);
          else return res.status(200).end();
        });
      }
      else {
        var newDoc = new DocumentDisplayTemplate({
          docTypeId: req.params.type_id,
          templateBody: req.body.templateBody,
          categoryTemplateBody: req.body.categoryTemplateBody
        });
        newDoc.save(function(err) {
          if (err) return next(err);
          else return res.status(200).end();
        });
      }
    });
});

export default router;
