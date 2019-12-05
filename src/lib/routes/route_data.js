import React from 'react';
import { LoginPage, FrontCategoryDisplay, FrontDocumentDisplay,
  FrontProfileDisplay, NotFound, SearchPage } from '../../client/views/front';
import { SignupPage, ConfigPage, EditDocumentLanding, EditDocumentPage,
  EditDisplayTemplate, ProfileEditPage, ChangePasswordPage, FileMgmtLanding,
  UploadFilePage, EditDocType, UserMgmtLanding, AdminLanding }
  from '../../client/views/admin';

export const frontEndRoutes = [
  {
    path: '/profile/:username',
    exact: true,
    component: FrontProfileDisplay
  },
  {
    path: '/:docType/:docNode',
    exact: true,
    component: FrontDocumentDisplay,
  },
  {
    path: '/not-found',
    exact: true,
    component: NotFound
  },
  {
    path: '/search',
    exact: true,
    component: SearchPage
  },
  {
    path: '/:docType',
    exact: true,
    component: FrontCategoryDisplay
  }, {
    path: '/',
    exact: true,
    component: () => <div />
  }, {
    path: '*',
    exact: true,
    component: NotFound
  }];

export const loggedOutRoutes = [
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
];

export const backEndRoutes = [
  {
    path: '/admin/new/:docTypeId',
    exact: true,
    component: EditDocumentPage,
    isAdmin: false
  },
  {
    path: '/admin/edit-document/:docNode',
    exact: true,
    component: EditDocumentPage,
    isAdmin: false
  },
  {
    path: '/admin/edit/:docType',
    exact: true,
    component: EditDocumentLanding,
    isAdmin: true
  },
  {
    path: '/admin/edit-template/:docTypeId',
    exact: true,
    component: EditDisplayTemplate,
    isAdmin: false
  },
  {
    path: '/admin/edit-type/:docTypeId',
    exact: true,
    component: EditDocType,
    isAdmin: false
  },
  {
    path: '/admin/edit-profile',
    exact: true,
    component: ProfileEditPage,
    isAdmin: false
  },
  {
    path: '/admin/edit-config',
    exact: true,
    component: ConfigPage,
    isAdmin: true
  },
  {
    path: '/admin/register-type',
    exact: true,
    component: EditDocType,
    isAdmin: true
  },
  {
    path: '/admin/change-password',
    exact: true,
    component: ChangePasswordPage,
    isAdmin: false
  },
  {
    path: '/admin/file-mgmt',
    exact: true,
    component: FileMgmtLanding,
    isAdmin: false
  },
  {
    path: '/admin/upload-file',
    exact: true,
    component: UploadFilePage,
    isAdmin: false
  },
  {
    path: '/admin/user-mgmt',
    exact: true,
    component: UserMgmtLanding,
    isAdmin: true
  },
  {
    path: '/admin',
    exact: true,
    component: AdminLanding,
    isAdmin: false
  }
];
