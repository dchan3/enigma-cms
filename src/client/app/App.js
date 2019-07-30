import React from 'react';
import { object, func, bool } from 'prop-types';
import { Route, Redirect, Switch } from 'react-router-dom';
import {
  ChangePasswordPage, ConfigPage, EditDisplayTemplate,
  EditDocumentLanding, EditDocumentPage, FileMgmtLanding,
  ProfileEditPage, SignupPage, EditDocType, UploadFilePage, MainMenu
} from '../views/admin';
import { FrontCategoryDisplay, FrontDocumentDisplay, FrontHeader,
  FrontProfileDisplay, HomePage, LoginPage, NotFound } from '../views/front';
import { Footer } from '../reusables';
import { Metamorph } from 'react-metamorph';

let FrontEndRoute = ({ component: Component, staticContext, ...rest }) => <Route
  exact {...rest} component={({ history, match }) => (
    <Component {...{ history, staticContext, match }} />)} />;

let ProtectedRoute = ({ component: Component, isAdmin, staticContext, ...rest
}) => <Route exact {...rest} component={({ history, match }) => {
  if (staticContext.user) {
    if ((isAdmin && staticContext.user.roleId === 0) || !isAdmin) {
      return <Component {...{ history, staticContext, match }} />;
    }
    else return <Redirect to="/admin" />;
  }
  else return <Redirect to="/login" />;
}} />;

let LoggedOutRoute =
  ({ component: Component, staticContext, ...rest }) => <Route exact {...rest}
    component={() => staticContext.user ? <Redirect to="/admin" /> :
      <Component {...{ staticContext }} />} />;

let UniversalRoute =
  ({ component: Component, staticContext, ...rest }) => <Route exact {...rest}
    component={({ history }) => <Component {...{
      staticContext, history }} />} />;

let App = ({ staticContext }) => {
  if (!staticContext) staticContext = window.__INITIAL_DATA__;
  let { config } = staticContext,
    { description, keywords, siteName, iconUrl } = config;
  return <div>
    <Metamorph title={siteName || 'My Website'}
      description={description || 'Welcome to my website!'}
      keywords={keywords && keywords.join(',') || ''} image={iconUrl || ''}/>
    <Switch>
      <ProtectedRoute path='/admin' component={MainMenu} isAdmin={false}
        {...{ staticContext }} />
      <FrontEndRoute path='*' {...{ staticContext }} component={FrontHeader}/>
    </Switch>
    <Switch>
      <ProtectedRoute path="/admin/edit-profile" isAdmin={false}
        {...{ staticContext }} component={ProfileEditPage} />
      <ProtectedRoute path="/admin/edit-config" isAdmin={true}
        {...{ staticContext }} component={ConfigPage} />
      <ProtectedRoute path="/admin/register-type" isAdmin={true}
        {...{ staticContext }} component={EditDocType} />
      <ProtectedRoute path='/admin/change-password' isAdmin={false}
        {...{ staticContext }} component={ChangePasswordPage} />
      <ProtectedRoute path='/admin/file-mgmt' isAdmin={false}
        {...{ staticContext }} component={FileMgmtLanding} />
      <ProtectedRoute path='/admin/upload-file' isAdmin={false}
        {...{ staticContext }} component={UploadFilePage} />
      <ProtectedRoute path='/admin/new/:docTypeId' isAdmin={false}
        {...{ staticContext }} component={EditDocumentPage} />
      <ProtectedRoute path='/admin/edit/:docType' isAdmin={true}
        {...{ staticContext }} component={EditDocumentLanding} />
      <ProtectedRoute path='/admin/edit-document/:docNode' isAdmin={false}
        {...{ staticContext }} component={EditDocumentPage}/>
      <ProtectedRoute path='/admin/edit-template/:docTypeId' isAdmin={false}
        {...{ staticContext }} component={EditDisplayTemplate} />
      <ProtectedRoute path='/admin/edit-type/:docTypeId' isAdmin={false}
        {...{ staticContext }} component={EditDocType}/>
      <ProtectedRoute path='/admin' isAdmin={false} {...{ staticContext }}
        component={() => <div />}/>
      <LoggedOutRoute path="/signup" {...{ staticContext }}
        component={SignupPage} />
      <LoggedOutRoute path="/login" {...{ staticContext }}
        component={LoginPage} />
      <FrontEndRoute path="/not-found" component={NotFound}
        {...{ staticContext }} />
      <FrontEndRoute path="/profile/:username" {...{ staticContext }}
        component={FrontProfileDisplay} />
      <FrontEndRoute path="/:docType/:docNode"  {...{ staticContext }}
        component={FrontDocumentDisplay} />
      <FrontEndRoute path="/:docType" component={FrontCategoryDisplay}
        {...{ staticContext }} />
      <FrontEndRoute path='/' {...{ staticContext }} component={HomePage} />
      <Route path="*" component={NotFound} />
    </Switch>
    <Switch>
      <UniversalRoute path="*" component={Footer} />
    </Switch>
  </div>;
};

[ProtectedRoute, LoggedOutRoute, FrontEndRoute].forEach((comp) => {
  if (!comp.propTypes) comp.propTypes = {
    staticContext: object, component: func
  };
});

ProtectedRoute.propTypes.isAdmin = bool;

App.propTypes = { staticContext: object };

export default App;
