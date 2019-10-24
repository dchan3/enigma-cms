import { Router } from 'express';
import { DocumentDisplayTemplate, DocumentType, Document } from '../../models';
import slug from 'limax';
import { default as verifyMiddleware } from '../middleware';
import { ObjectId } from 'mongodb';
import { default as documentFetchFuncs } from '../fetch_funcs/documents';

var router = Router();

router.get('/get_types', async function (req, res) {
  return res.status(200).json(await documentFetchFuncs.getTypes());
});

router.get('/get_type/:id', async function(req, res) {
  let retval = await documentFetchFuncs.getType(parseInt(req.params.id));
  return res.json(retval);
});

router.get('/get_type_2/:id', async function(req, res) {
  let retval = await documentFetchFuncs.getType2(parseInt(req.params.id));
  return res.json(retval);
});

router.get('/get_document_and_type_info/:id', async function(req, res) {
  let retval = await documentFetchFuncs.getDocumentAndTypeInfo(req.params.id);
  return res.json(retval);
});

router.get('/get_rendered_document_by_type_and_slug/:type/:slug',
  async function({
    params: {
      type, slug
    } }, res) {
    let retval =
      await documentFetchFuncs.getRenderedDocumentByTypeAndSlug(type, slug);
    return res.json(retval);
  });

router.get('/get_documents/:id', async function (req, res) {
  let retval = await documentFetchFuncs.getDocuments(parseInt(req.params.id));
  return res.status(200).json(retval);
});

router.get('/get_rendered_documents_by_type_name/:docTypeNamePlural', async ({
  params: { docTypeNamePlural }
}, res) =>
{
  let retval =
    await documentFetchFuncs.getRenderedDocumentsByTypeName(docTypeNamePlural);
  return res.status(200).json(retval);
});

router.get('/get_template/:id', async (req, res) => {
  let retval = await documentFetchFuncs.getTemplate(req.params.id);
  return res.status(200).json(retval);
});

router.post('/register_type', verifyMiddleware, ({ body }, res, next) => {
  let newType = new DocumentType();
  let reset = [];
  for (let attr in body) {
    if (attr.indexOf('.') > -1) {
      let [mainKey,] = attr.split('.');
      if (!reset.includes(mainKey)) {
        newType.set(mainKey, {});
        reset.push(mainKey);
      }
    }
    newType.set(attr, body[attr]);
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

router.post('/update_type/:id', verifyMiddleware,
  ({ body, params: { id: docTypeId } }, res, next) => {
    DocumentType.findOne({ docTypeId }).then(newType => {
      let reset = [];
      for (var attr in body) {
        if (attr.indexOf('.') > -1) {
          var mainKey = attr.split('.')[0];
          if (!reset.includes(mainKey)) {
            newType.set(mainKey, {});
            reset.push(mainKey);
          }
        }
        newType.set(attr, body[attr]);
      }
      newType.save(function (err) {
        if (err) return next(err);
        else res.redirect('/admin/');
      })
    })
  });

router.post('/new_document/:type_id', verifyMiddleware,
  ({ params: { type_id: docTypeId, node_id },
    user: { userId }, body }, res) => {
    let newDoc = new Document({
        docTypeId,
        createdAt: new Date(),
        creatorId: userId,
        editedAt: new Date(),
        editorId: userId
      }), reset = [];
    for (var attr in body) {
      if (attr !== 'draft') {
        if (attr.indexOf('.') > -1) {
          var mainKey = attr.split('.')[0];
          if (!reset.includes(mainKey)) {
            newDoc.set(`content.${mainKey}`, {});
            reset.push(mainKey);
          }
        }
        newDoc.set(`content.${attr}`, body[attr]);
      }
      else { newDoc.set(attr, body[attr]); }
    }
    DocumentType.findOne({ docTypeId }).then(({ slugFrom }) => {
      let propSlug = slug(newDoc.content[slugFrom]);
      Document.find({ docNodeId: { $ne: node_id }, slug: {
        $regex: new RegExp(`^${propSlug}`)
      } }).sort({ slug: -1 }).then(({ length }) => {
        if (length > 0) {
          propSlug = `${slug}-${length}`;
        }
        newDoc.set('slug', propSlug);
        newDoc.save(function(err) {
          if (err) res.status(500);
          else res.redirect('/admin/');
        });
      });
    }).catch(() => { res.status(500); });
  });

router.post('/update_document/:node_id', verifyMiddleware, (
  { params: { node_id: docNodeId }, body, user }, res, next) => {
  Document.findOne({ docNodeId }).then(doc => {
    doc.set('editedAt', new Date());
    doc.set('editorId', user.userId);
    var reset = [];
    for (var attr in body) {
      if (attr !== '') {
        if (attr !== 'draft') {
          if (attr.indexOf('.') > -1) {
            var mainKey = attr.split('.')[0];
            if (!reset.includes(mainKey)) {
              doc.set(`content.${mainKey}`, {});
              reset.push(mainKey);
            }
          }
          doc.set(`content.${attr}`, body[attr]);
        }
        else { doc.set(attr, body[attr]); }
      }
    }
    DocumentType.findOne({ docTypeId: doc.docTypeId }).then(({ slugFrom }) => {
      let propSlug = slug(doc.content[slugFrom]);
      Document.find({ docNodeId: { $ne: docNodeId }, slug: {
        $regex: new RegExp(`^${propSlug}`)
      } }).sort({ slug: -1 }).then(({ length }) => {
        if (length > 0) {
          propSlug = `${slug}-${length}`;
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

router.delete('/delete_document/:docType/:id',
  ({ user, params: { docType: docTypeId, id } }, res, next) => {
    if (user) return Document.findOneAndDelete({
      _id: ObjectId(id), docTypeId
    }).then(
      () => res.redirect(`/admin/edit/${docTypeId}`))
      .catch(err => next(err));
    else
      return res.status(500).redirect('/login').end();
  });

router.post('/update_template/:type_id', verifyMiddleware,
  ({ body: {
    templateBody, categoryTemplateBody
  }, params: { type_id: docTypeId } }, res, next) => {
    DocumentDisplayTemplate.findOne({ docTypeId }).then(
      doc => {
        if (doc) {
          doc.set('templateBody', templateBody);
          doc.set('categoryTemplateBody', categoryTemplateBody);
          doc.save(function(err) {
            if (err) return next(err);
            else return res.status(200).end();
          });
        }
        else {
          var newDoc = new DocumentDisplayTemplate({
            docTypeId, templateBody, categoryTemplateBody
          });
          newDoc.save(function(err) {
            if (err) return next(err);
            else return res.status(200).end();
          });
        }
      });
  });

export default router;
