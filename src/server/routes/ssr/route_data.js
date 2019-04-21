import HomePage from '../../../client/views/front/HomePage';
import MainMenu from '../../../client/views/admin/MainMenu';
import SignupPage from '../../../client/views/admin/SignupPage';
import LoginPage from '../../../client/views/front/LoginPage';
import ConfigPage from '../../../client/views/admin/ConfigPage';
import RegisterDocType from '../../../client/views/admin/RegisterDocType';
import DocumentEditPage from '../../../client/views/admin/DocumentEditPage';
import DocumentUpdatePage from '../../../client/views/admin/DocumentUpdatePage';
import EditDocumentLanding from
  '../../../client/views/admin/EditDocumentLanding';
import EditDisplayTemplate from
  '../../../client/views/admin/EditDisplayTemplate';
import FrontDocumentDisplay from
  '../../../client/views/front/FrontDocumentDisplay';
import FrontProfileDisplay from
  '../../../client/views/front/FrontProfileDisplay';
import UpdateDocType from '../../../client/views/admin/UpdateDocType';
import NotFound from '../../../client/views/front/NotFound';
import ProfileEditPage from '../../../client/views/admin/ProfileEditPage';
import ChangePasswordPage from '../../../client/views/admin/ChangePasswordPage';
import FileMgmtLanding from '../../../client/views/admin/FileMgmtLanding';
import UploadFilePage from '../../../client/views/admin/UploadFilePage';

import Document from '../../models/Document';
import DocumentType from '../../models/DocumentType';
import File from '../../models/File';
import User from '../../models/User';
import DocumentDisplayTemplate from '../../models/DocumentDisplayTemplate';

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
    }),
    key: 'profileUser'
  },
  {
    path: '/:docType/:docNode',
    exact: true,
    component: FrontDocumentDisplay,
    fetchInitialData: async (path) => {
      var [ typeName, slug ] = path.split('/').slice(-2);
      var docType = await DocumentType.findOne({ docTypeName: typeName });
      var template =
        await DocumentDisplayTemplate.findOne({ docTypeId: docType.docTypeId });
      var doc = await Document.findOne({ slug: slug });
      return { templateBody: template.templateBody, doc };
    },
    key: 'dataObj'
  },
  {
    path: '/not-found',
    exact: true,
    component: NotFound
  }];

export const backEndRoutes = [
  {
    path: '/admin/new/:docTypeId',
    exact: true,
    component: DocumentEditPage,
    fetchInitialData: path =>
      DocumentType.find({ docTypeId: path.split('/').pop() }),
    key: 'docType'
  },
  {
    path: '/admin/edit-document/:docNode',
    exact: true,
    component: DocumentUpdatePage,
    fetchInitialData: async (path) => {
      var [ typeId, slug ] = path.split('/').slice(-2);
      var docType = await DocumentType.findOne({ docTypeId: typeId });
      var doc = await Document.findOne({ slug: slug });
      return { docType, doc };
    },
    key: 'dataObj'
  },
  {
    path: '/admin/edit/:docType',
    exact: true,
    component: EditDocumentLanding,
    fetchInitialData: path =>
      Document.find({ docTypeId: path.split('/').pop() }),
    key: 'dataObj'
  },
  {
    path: '/admin/edit-template/:docTypeId',
    exact: true,
    component: EditDisplayTemplate,
    fetchInitialData: path =>
      DocumentType.find({ docTypeId: path.split('/').pop() }),
    key: 'dataObj'
  },
  {
    path: '/admin/edit-type/:docTypeId',
    exact: true,
    component: UpdateDocType
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
    fetchInitialData: () => File.find({}),
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
  },
];
