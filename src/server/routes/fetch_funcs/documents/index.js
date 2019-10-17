import { Document, DocumentType, DocumentDisplayTemplate }
  from '../../../models';

async function getTypes() {
  let types = await DocumentType.find({ });
  return types;
}

async function getDocuments(id) {
  let { docTypeId } = await DocumentType.findOne({
      docTypeId: parseInt(id)
    }), docs = await Document.find(docTypeId);

  return docs;
}

async function getType2(id) {
  let docType = await DocumentType.findOne({ docTypeId: id });
  return { docType };
}

export default { getTypes, getDocuments, getType2 };
