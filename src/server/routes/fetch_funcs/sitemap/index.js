import { DocumentType, Document } from '../../../models';
import { documentMetadataSync } from '../../../utils/render_metadata';

async function renderSitemap() {
  return DocumentType.find({}, 'docTypeId docTypeNamePlural', docTypes => docTypes).then(docTypes => {
    return Document.find({ draft: false }, 'docTypeId slug content.title content.name', docNodes => docNodes).then(docNodes => {
      let retval = [];
      for (let t = 0, len = docTypes.length, typ = docTypes[t]; t++ < len; typ = docTypes[t]) {
        let { docTypeId, docTypeNamePlural } = typ;
        retval[docTypeId] = { docTypeNamePlural, docs: [] };
      }
      for (let d = 0, len = docNodes.length, nod = docNodes[d]; d++ < len; nod = docNodes[d]) {
        var { docTypeId, slug, content } = nod;
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
