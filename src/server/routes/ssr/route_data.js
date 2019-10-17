import { HomePage, LoginPage, FrontCategoryDisplay, FrontDocumentDisplay,
  FrontProfileDisplay, NotFound } from '../../../client/views/front';
import { MainMenu, SignupPage, ConfigPage, EditDocumentLanding,
  EditDocumentPage, EditDisplayTemplate, ProfileEditPage, ChangePasswordPage,
  FileMgmtLanding, UploadFilePage, EditDocType
} from '../../../client/views/admin';
import { Document, DocumentType, File, User, DocumentDisplayTemplate
} from '../../models';
import renderMarkup, { prepareDocumentsForRender } from
  '../../utils/render_markup';
import { categoryMetadata, documentMetadata } from
  '../../utils/render_metadata';
import { default as userFetchFuncs } from '../fetch_funcs/users'
import { default as documentFetchFuncs } from '../fetch_funcs/documents';

export const frontEndRoutes = [
  {
    path: '/',
    exact: true,
    component: HomePage
  },
  {
    path: '/login',
    exact: true,
    component: LoginPage,
  },
  {
    path: '/signup',
    exact: true,
    component: SignupPage,
  },
  {
    path: '/profile/:username',
    exact: true,
    component: FrontProfileDisplay,
    fetchInitialData: async (path) => {
      return await userFetchFuncs.getUserProfile(null, {
        username: path.split('/').pop() });
    }
  },
  {
    path: '/:docType',
    exact: true,
    component: FrontCategoryDisplay,
    fetchInitialData: async (path) => {
      let docTypeNamePlural = path.replace(/\//g, ''),
        docType = await DocumentType.findOne({ docTypeNamePlural });
      if (!docType) return null;
      var { docTypeId } = docType, docDisplayTemplate =
        await DocumentDisplayTemplate.findOne({ docTypeId });
      if (!docDisplayTemplate) return null;
      var { categoryTemplateBody } = docDisplayTemplate,
        docs = await Document.find({
          docTypeId, draft: false
        }).sort({ createdAt: -1 });

      let items = prepareDocumentsForRender(docs),
        rendered = await renderMarkup(categoryTemplateBody, { items }),
        metadata = await categoryMetadata(docTypeNamePlural);

      return {
        docTypeNamePlural,
        rendered,
        metadata
      };
    }
  },
  {
    path: '/:docType/:docNode',
    exact: true,
    component: FrontDocumentDisplay,
    fetchInitialData: async (path) => {
      var [ docTypeNamePlural, slug ] = path.split('/').slice(-2),
        { docTypeId } = await DocumentType.findOne({ docTypeNamePlural }),
        { templateBody } =
          await DocumentDisplayTemplate.findOne({ docTypeId }),
        doc = await Document.findOne({ slug, draft: false });
      if (!doc) return undefined;
      let authorInfo = await User.findOne({
        userId: doc.creatorId
      }).select({ password: 0, _id: 0 });

      let { content, editedAt, createdAt } = doc,
        metadata = await documentMetadata(content);

      let rendered = await renderMarkup(templateBody,
        { ...content, createdAt, editedAt, authorInfo });

      if (doc) return {
        authorInfo, rendered, slug, editedAt, createdAt, metadata };
      else return undefined;
    }
  },
  {
    path: '/not-found',
    exact: true,
    component: NotFound
  }, {
    path: '*',
    exact: true,
    component: NotFound
  }];

export const backEndRoutes = [
  {
    path: '/admin/new/:docTypeId',
    exact: true,
    component: EditDocumentPage,
    fetchInitialData: async (path) => {
      let docType = await documentFetchFuncs.getType2(path.split('/').pop());
      return { docType };
    }
  },
  {
    path: '/admin/edit-document/:docNode',
    exact: true,
    component: EditDocumentPage,
    fetchInitialData: async (path) => {
      let docNodeId = path.split('/').pop(),
        doc = await Document.findOne({ docNodeId }), { docTypeId } = doc,
        docType = await DocumentType.findOne({ docTypeId });
      return { docType, doc };
    }
  },
  {
    path: '/admin/edit/:docType',
    exact: true,
    component: EditDocumentLanding,
    fetchInitialData: async path => {
      let docTypeId = path.split('/').pop(),
        documents = await Document.find({ docTypeId }),
        docType = await DocumentType.findOne({ docTypeId });
      return { documents, docType };
    }
  },
  {
    path: '/admin/edit-template/:docTypeId',
    exact: true,
    component: EditDisplayTemplate,
    fetchInitialData: async path => {
      var docTypeId = path.split('/').pop();
      var docType = await
        DocumentType.findOne({ docTypeId }),
        { templateBody, categoryTemplateBody } =
          await DocumentDisplayTemplate.findOne({ docTypeId });
      return { docType, templateBody, categoryTemplateBody };
    }
  },
  {
    path: '/admin/edit-type/:docTypeId',
    exact: true,
    component: EditDocType,
    fetchInitialData: async path => {
      let docType =
        await DocumentType.findOne({ docTypeId: path.split('/').pop() });
      return { docType };
    }
  },
  {
    path: '/admin/edit-profile',
    exact: true,
    component: ProfileEditPage
  },
  {
    path: '/admin/edit-config',
    exact: true,
    component: ConfigPage
  },
  {
    path: '/admin/register-type',
    exact: true,
    component: EditDocType
  },
  {
    path: '/admin/change-password',
    exact: true,
    component: ChangePasswordPage
  },
  {
    path: '/admin/file-mgmt',
    exact: true,
    component: FileMgmtLanding,
    fetchInitialData: async () => {
      var retval = await File.find({});
      return retval && retval.length > 0 && retval || [];
    }
  },
  {
    path: '/admin/upload-file',
    exact: true,
    component: UploadFilePage
  },
  {
    path: '/admin',
    exact: false,
    component: MainMenu
  }
];
