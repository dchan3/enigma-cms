import { Document, DocumentType, DocumentDisplayTemplate, User }
  from '../../../models';
import renderMarkup, { prepareDocumentsForRender }
  from '../../../utils/render_markup';
import { categoryMetadata,
  documentMetadata } from '../../../utils/render_metadata';

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
  let docType = await DocumentType.findOne({
    $or: [
      { docTypeName: type },
      { docTypeNamePlural: type }]
  });
  if (!docType) return {};
  let { docTypeId } = docType,
    { templateBody } = await DocumentDisplayTemplate.findOne({ docTypeId }),
    doc =
      await Document.findOne({ docTypeId, slug });

  if (!doc) return {};
  let { creatorId, content, createdAt, editedAt } = doc,
    authorInfo = await User.findOne({ userId: creatorId })
      .select({ password: 0, _id: 0 }),
    metadata = await documentMetadata(content),
    rendered = await renderMarkup(templateBody, {
      ...content, createdAt, editedAt, authorInfo });

  return {
    slug,
    editedAt,
    createdAt,
    authorInfo,
    rendered,
    metadata
  };
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
