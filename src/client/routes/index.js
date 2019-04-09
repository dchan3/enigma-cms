import React, { Component } from 'react';
import HomePage from '../views/HomePage';
import MainMenu from '../views/MainMenu';
import SignupPage from '../views/SignupPage';
import LoginPage from '../views/LoginPage';
import ConfigPage from '../views/ConfigPage';
import RegisterDocType from '../views/RegisterDocType';
import DocumentEditPage from '../views/DocumentEditPage';
import DocumentUpdatePage from '../views/DocumentUpdatePage';
import EditDocumentLanding from '../views/EditDocumentLanding';
import EditDisplayTemplate from '../views/EditDisplayTemplate';
import FrontDocumentDisplay from '../views/FrontDocumentDisplay';
import FrontProfileDisplay from '../views/FrontProfileDisplay';
import UpdateDocType from '../views/UpdateDocType';
import NotFound from '../views/NotFound';
import ProfileEditPage from '../views/ProfileEditPage';
import ChangePasswordPage from '../views/ChangePasswordPage';

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
    path: '/admin',
    exact: true,
    component: () => <div />
  }
];
