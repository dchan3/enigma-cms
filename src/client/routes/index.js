import HomePage from '../views/front/HomePage';
import MainMenu from '../views/admin/MainMenu';
import SignupPage from '../views/admin/SignupPage';
import LoginPage from '../views/front/LoginPage';
import ConfigPage from '../views/admin/ConfigPage';
import RegisterDocType from '../views/admin/RegisterDocType';
import DocumentEditPage from '../views/admin/DocumentEditPage';
import DocumentUpdatePage from '../views/admin/DocumentUpdatePage';
import EditDocumentLanding from '../views/admin/EditDocumentLanding';
import EditDisplayTemplate from '../views/admin/EditDisplayTemplate';
import FrontDocumentDisplay from '../views/front/FrontDocumentDisplay';
import FrontProfileDisplay from '../views/front/FrontProfileDisplay';
import UpdateDocType from '../views/admin/UpdateDocType';
import NotFound from '../views/front/NotFound';
import ProfileEditPage from '../views/admin/ProfileEditPage';
import ChangePasswordPage from '../views/admin/ChangePasswordPage';

import fetch from 'isomorphic-fetch';
import { default as urlUtils } from '../../lib/utils';

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
    fetchInitialData: (path) => fetch(
      urlUtils.info.path(
        `/api/users/get_user_by_username/${path.split('/').pop()}`)),
    key: 'profileUser'
  },
  {
    path: '/:docType/:docNode',
    exact: true,
    component: FrontDocumentDisplay,
    fetchInitialData: (path) => fetch(
      urlUtils.info.path(
        `/api/documents/get_document_by_type_and_slug/${
          path.split('/').slice(-2).join('/')}`)
    ),
    key: 'dataObj'
  },
  {
    path: '/not-found',
    exact: true,
    component: NotFound
  }];

export const backEndRoutes = [
  {
    path: '/admin',
    exact: false,
    component: MainMenu
  },
  {
    path: '/admin/new/:docTypeId',
    exact: true,
    component: DocumentEditPage,
    fetchInitialData: path => fetch(
      urlUtils.info.path(
        `/api/documents/get_type/${path.split('/').pop()}`)),
    key: 'docType'
  },
  {
    path: '/admin/edit-document/:docNode',
    exact: true,
    component: DocumentUpdatePage,
    fetchInitialData: path => fetch(
      urlUtils.info.path(
        `/api/documents/get_document/${path.split('/').pop()}`)),
    key: 'dataObj'
  },
  {
    path: '/admin/edit/:docType',
    exact: true,
    component: EditDocumentLanding,
    fetchInitialData: path => fetch(
      urlUtils.info.path(
        `/api/documents/get_documents/${path.split('/').pop()}`)),
    key: 'dataObj'
  },
  {
    path: '/admin/edit-template/:docTypeId',
    exact: true,
    component: EditDisplayTemplate,
    fetchInitialData: path => fetch(
      urlUtils.info.path(
        `/api/documents/get_template/${path.split('/').pop()}`)),
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
    path: '/admin/edit-profile',
    exact: true,
    component: ProfileEditPage
  }
];
