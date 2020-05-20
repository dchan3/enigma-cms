import { Document, DocumentType, DocumentDisplayTemplate }
  from '../../../models';
import renderMarkup, { prepareDocumentsForRender }
  from '../../../utils/render_markup';
import { categoryMetadata,
  documentMetadata } from '../../../utils/render_metadata';
import fs from 'fs';
import path from 'path';

async function getTypes() {
  let types = await DocumentType.find({ });
  return types;
}

async function getDocuments(docTypeId) {
  let docType = await DocumentType.findOne({
      docTypeId
    }), documents = await Document.find({ docTypeId });

  return { documents, docType };
}

async function getType(docTypeId) {
  let docType = await DocumentType.findOne({ docTypeId });
  return docType;
}

async function getType2(docTypeId) {
  let docType = await DocumentType.findOne({ docTypeId });
  return { docType };
}

async function getRenderedDocumentByTypeAndSlug(type, slug) {
  let filename = path.join(__dirname, `documents/${type}/${slug}.enigma`), data = '', retval;
  try {
    if (!fs.exists(filename)) throw '';

    data = fs.readFileSync(filename);
    if (!data) throw '';

    retval = JSON.parse(data);
    if (!retval) throw '';
  } catch {
    let docType = await DocumentType.findOne({
      $or: [
        { docTypeName: type },
        { docTypeNamePlural: type }]
    });
    if (!docType) return {};
    let { docTypeId } = docType,
      doc = await Document.findOne({ docTypeId, slug });

    if (!doc) return {};

    let { rendered, content } = doc,
      metadata = await documentMetadata(content);
    retval = { rendered, metadata, slug };
  }
  return retval;
}

async function getRenderedDocumentsByTypeName(docTypeNamePlural) {
  let docType = await DocumentType.findOne({
    docTypeNamePlural
  });

  if (!docType) return {};
  let { docTypeId } = docType, { categoryTemplateBody } =
    await DocumentDisplayTemplate.findOne({ docTypeId }),
    docs = await Document.find({ docTypeId, draft: false }).sort({
      createdAt: -1 }),
    items = await prepareDocumentsForRender(docs),
    metadata = await categoryMetadata(docTypeNamePlural),
    rendered = await renderMarkup(categoryTemplateBody, { items });

  return {
    docTypeNamePlural,
    rendered,
    metadata
  };
}

async function getDocumentAndTypeInfo(docNodeId) {
  let doc = await Document.findOne({ docNodeId }),
    docType = await DocumentType.findOne({ docTypeId: doc.docTypeId });
  return {
    docType, doc
  };
}

async function getTemplate(docTypeId) {
  let docType = await DocumentType.findOne({
      docTypeId
    }),
    template = await DocumentDisplayTemplate.findOne({ docTypeId });
  return {
    categoryTemplateBody: template ? template.categoryTemplateBody : '',
    templateBody: template ? template.templateBody : '',
    docType
  };
}

export default { getTypes, getDocuments, getType, getType2,
  getRenderedDocumentByTypeAndSlug, getRenderedDocumentsByTypeName,
  getDocumentAndTypeInfo, getTemplate };
