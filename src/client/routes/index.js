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

export default [
  {
    path: '/',
    exact: true,
    component: HomePage
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
    path: '/admin',
    exact: false,
    component: MainMenu
  },
  {
    path: '/admin/config',
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
    path: '/not-found',
    exact: true,
    component: NotFound
  },
  {
    path: '/admin/register-type',
    exact: 'true',
    component: RegisterDocType
  },
  {
    path: '/admin/new/:docTypeId',
    exact: 'true',
    component: DocumentEditPage
  },
  {
    path: '/admin/edit-document/:docNode',
    exact: 'true',
    component: DocumentUpdatePage
  },
  {
    path: '/admin/edit/:docType',
    exact: true,
    component: EditDocumentLanding
  },
  {
    path: '/:docType/:docNode',
    exact: true,
    component: FrontDocumentDisplay
  },
  {
    path: '/admin/edit-template/:docTypeId',
    exact: true,
    component: EditDisplayTemplate
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
  }
];
