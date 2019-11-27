import { Document, DocumentType, File } from '../../models';
import { default as userFetchFuncs } from '../fetch_funcs/users';
import { default as documentFetchFuncs } from '../fetch_funcs/documents';

export default {
  '/profile/:username': async (path) => {
    return await userFetchFuncs.getUserProfile({
      username: path.split('/').pop() });
  },
  '/:docType/:docNode': async (path) => {
    let [ docTypeNamePlural, slug ] = path.split('/').slice(-2),
      retval = await documentFetchFuncs.getRenderedDocumentByTypeAndSlug(
        docTypeNamePlural, slug
      )
    return retval;
  },
  '/:docType': async (path) => {
    let docTypeNamePlural = path.replace(/\//g, ''), retval = await
    documentFetchFuncs.getRenderedDocumentsByTypeName(docTypeNamePlural);

    return retval;
  },
  '/admin/new/:docTypeId': async (path) => {
    let docType = await documentFetchFuncs.getType2(path.split('/').pop());
    return { docType };
  },
  '/admin/edit-document/:docNode': async (path) => {
    let docNodeId = path.split('/').pop(),
      doc = await Document.findOne({ docNodeId }), { docTypeId } = doc,
      docType = await DocumentType.findOne({ docTypeId });
    return { docType, doc };
  },
  '/admin/edit/:docType': async path => {
    return await documentFetchFuncs.getDocuments(path.split('/').pop());
  },
  '/admin/edit-template/:docTypeId': async path => {
    let docTypeId = path.split('/').pop(),
      retval = await documentFetchFuncs.getTemplate(docTypeId);
    return retval;
  },
  '/admin/edit-type/:docTypeId': async path => {
    let retval =
      await documentFetchFuncs.getType2(parseInt(path.split('/').pop(), 10));
    return retval;
  },
  '/admin/file-mgmt': async () => {
    var retval = await File.find({});
    return retval && retval.length > 0 && retval || [];
  },
  '/admin/user-mgmt': async () => {
    var users = await userFetchFuncs.getAllUsers({ });
    return { users };
  }
}
