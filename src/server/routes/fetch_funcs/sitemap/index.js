import { DocumentType, Document } from '../../../models';
import { documentMetadataSync } from '../../../utils/render_metadata';

async function renderSitemap() {
  return DocumentType.find({}, 'docTypeId docTypeNamePlural', docTypes => docTypes).then(docTypes => {
    return Document.find({}, 'docTypeId slug content.title content.name', docNodes => docNodes).then(docNodes => {
      let retval = [];
      for (let t = 0; t < docTypes.length; t++) {
        let { docTypeId, docTypeNamePlural } = docTypes[t];
        retval[docTypeId] = { docTypeNamePlural, docs: [] };
      }
      for (let d = 0; d < docNodes.length; d++) {
        var { docTypeId, slug, content } = docNodes[d];
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
