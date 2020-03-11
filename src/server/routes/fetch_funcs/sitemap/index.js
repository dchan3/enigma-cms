import { DocumentType, Document } from '../../../models';
import { documentMetadata } from '../../../utils/render_metadata';

async function renderSitemap() {
  let docTypes = await DocumentType.find({}), docNodes = await Document.find({});
  let retval = {};
  docTypes.forEach(function({ docTypeId, docTypeNamePlural }) {
    return retval[docTypeId] = { docTypeNamePlural, docs: [] };
  });
  for (let d = 0; d < docNodes.length; d++) {
    var { docTypeId, slug } = docNodes[d], { title } = await documentMetadata(docNodes[d].content, false);
    retval[docTypeId].docs.push([ slug, title ]);
  }
  return retval;
}

export default { renderSitemap };
