import { DocumentType, Document } from '../../../models';
import { documentMetadataSync } from '../../../utils/render_metadata';

async function renderSitemap() {
  return DocumentType.find({}, 'docTypeId docTypeNamePlural', docTypes => docTypes).then(docTypes => {
    return Document.find({ draft: false }, 'docTypeId slug content.title content.name', docNodes => docNodes).then(docNodes => {
      let retval = [];
      for (let { docTypeId, docTypeNamePlural } of docTypes) {
        retval[docTypeId] = { docTypeNamePlural, docs: [] };
      }
      for (let { docTypeId, slug, content } of docNodes) {
        if (content) {
          let { title } = documentMetadataSync(content);
          retval[docTypeId].docs.push([ slug, title ]);
        }
      }
      return retval;
    });
  });
}

export default { renderSitemap };
