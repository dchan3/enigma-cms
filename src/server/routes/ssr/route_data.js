import { HomePage, LoginPage, FrontCategoryDisplay, FrontDocumentDisplay,
  FrontProfileDisplay, NotFound } from '../../../client/views/front';
import { MainMenu, SignupPage, ConfigPage, EditDocumentLanding,
  EditDocumentPage, EditDisplayTemplate, ProfileEditPage, ChangePasswordPage,
  FileMgmtLanding, UploadFilePage, EditDocType
} from '../../../client/views/admin';
import { Document, DocumentType, File, User, DocumentDisplayTemplate } from
  '../../models';

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
    fetchInitialData: (path) => User.findOne({
      username: path.split('/').pop()
    }).select({ password: 0, _id: 0 }),
    key: 'profileUser'
  },
  {
    path: '/:docType',
    exact: true,
    component: FrontCategoryDisplay,
    fetchInitialData: async (path) => {
      let docTypeNamePlural = path.replace(/\//g, ''),
        docType = await DocumentType.findOne({ docTypeNamePlural });
      if (!docType) return null;
      var { docTypeId } = docType,
        template = await DocumentDisplayTemplate.findOne({ docTypeId });
      if (!template) return null;
      var { categoryTemplateBody } = template,
        items = await Document.find({
          docTypeId, draft: false
        }).sort({ createdAt: -1 });
      return { categoryTemplateBody, items, typeName: docTypeNamePlural };
    }
  },
  {
    path: '/:docType/:docNode',
    exact: true,
    component: FrontDocumentDisplay,
    fetchInitialData: async (path) => {
      var [ docTypeNamePlural, slug ] = path.split('/').slice(-2),
        { docTypeId } = await DocumentType.findOne({ docTypeNamePlural }),
        { templateBody, categoryTemplateBody } =
          await DocumentDisplayTemplate.findOne({ docTypeId }),
        doc = await Document.findOne({ slug, draft: false });
      if (doc) return { templateBody, doc, categoryTemplateBody };
      else return { };
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
      let docType = await DocumentType.findOne({
        docTypeId: path.split('/').pop()
      });
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
    fetchInitialData: async path =>
      await DocumentType.findOne({ docTypeId: path.split('/').pop() }),
    key: 'docType'
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
    },
    key: 'files'
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
