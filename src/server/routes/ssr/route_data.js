import { HomePage, LoginPage, FrontCategoryDisplay, FrontDocumentDisplay,
  FrontProfileDisplay, NotFound
} from '../../../client/views/front';
import { MainMenu, SignupPage, ConfigPage, RegisterDocType, DocumentEditPage,
  DocumentUpdatePage, EditDocumentLanding, EditDisplayTemplate, UpdateDocType,
  ProfileEditPage, ChangePasswordPage, FileMgmtLanding, UploadFilePage
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
      let typeName = path.replace(/\//g, ''),
        docType = await DocumentType.findOne({ docTypeNamePlural: typeName });
      if (!docType) return null;
      var { docTypeId } = docType,
        template = await DocumentDisplayTemplate.findOne({ docTypeId });
      if (!template) return null;
      var { categoryTemplateBody } = template;
      var items = await Document.find({
        docTypeId,
        draft: false
      }).sort({ createdAt: -1 });
      return { categoryTemplateBody, items, typeName };
    },
    key: 'dataObj'
  },
  {
    path: '/:docType/:docNode',
    exact: true,
    component: FrontDocumentDisplay,
    fetchInitialData: async (path) => {
      var [ typeName, slug ] = path.split('/').slice(-2);
      var { docTypeId } =
        await DocumentType.findOne({ docTypeNamePlural: typeName });
      var { templateBody } =
        await DocumentDisplayTemplate.findOne({ docTypeId });
      var doc = await Document.findOne({ slug: slug, draft: false });
      if (doc) return { templateBody, doc };
      else return { };
    },
    key: 'dataObj'
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
    component: DocumentEditPage,
    fetchInitialData: path =>
      DocumentType.findOne({ docTypeId: path.split('/').pop() }),
    key: 'docType'
  },
  {
    path: '/admin/edit-document/:docNode',
    exact: true,
    component: DocumentUpdatePage,
    fetchInitialData: async (path) => {
      let nodeId = path.split('/').pop(),
        doc = await Document.findOne({ docNodeId: nodeId }),
        docType = await DocumentType.findOne({ docTypeId: doc.docTypeId });
      return { docType, doc };
    },
    key: 'dataObj'
  },
  {
    path: '/admin/edit/:docType',
    exact: true,
    component: EditDocumentLanding,
    fetchInitialData: async path => {
      let typeId = path.split('/').pop(),
        documents = await Document.find({ docTypeId: typeId  }),
        docType = await DocumentType.findOne({ docTypeId: typeId });
      return { documents, docType };
    },
    key: 'dataObj'
  },
  {
    path: '/admin/edit-template/:docTypeId',
    exact: true,
    component: EditDisplayTemplate,
    fetchInitialData: async path => {
      var docTypeId =  path.split('/').pop();
      var docType = await
        DocumentType.findOne({ docTypeId }),
        { templateBody, categoryTemplateBody } =
          await DocumentDisplayTemplate.findOne({ docTypeId });
      return { docType, templateBody, categoryTemplateBody };
    },
    key: 'dataObj'
  },
  {
    path: '/admin/edit-type/:docTypeId',
    exact: true,
    component: UpdateDocType,
    fetchInitialData: path =>
      DocumentType.findOne({ docTypeId: path.split('/').pop() }),
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
    component: RegisterDocType
  },
  {
    path: '/admin/change-password',
    exact: true,
    component: ChangePasswordPage
  },
  {
    path: '/admin/register-type',
    exact: true,
    component: RegisterDocType
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
