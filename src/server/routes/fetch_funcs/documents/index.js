import { Document, DocumentType, DocumentDisplayTemplate }
  from '../../../models';

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

async function getType2(id) {
  let docType = await DocumentType.findOne({ docTypeId: id });
  return { docType };
}

export default { getTypes, getDocuments, getType2 };
