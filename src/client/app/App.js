import React from 'react';
import { object, func, bool } from 'prop-types';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ChangePasswordPage, ConfigPage, EditDisplayTemplate,
  EditDocumentLanding, EditDocumentPage, FileMgmtLanding, MainMenu,
  ProfileEditPage, SignupPage, EditDocType, UploadFilePage
} from '../views/admin';
import { FrontCategoryDisplay, FrontDocumentDisplay, FrontHeader,
  FrontProfileDisplay, HomePage, LoginPage, NotFound } from '../views/front';
import { Footer } from '../reusables';
import { Metamorph } from 'react-metamorph';

let ProtectedRoute =
  ({ component: Component, isAdmin, staticContext, ...rest }) => (
    <Route {...rest} render={(props) => {
      if (staticContext.user) {
        if ((isAdmin && staticContext.user.roleId === 0) || !isAdmin) {
          return [<MainMenu staticContext={staticContext} />,
            <Component {...props} staticContext={staticContext} />];
        }
        else return <Redirect to="/admin" />
      }
      else return <Redirect to="/login" />
    }} />), LoggedOutRoute =
  ({ component: Component, staticContext, ...rest }) => (<Route {...rest}
    render={(props) =>
      staticContext.user ? <Redirect to="/admin" /> : (
        <Component {...props} staticContext={staticContext} />)
    } />
  ),
  FrontEndRoute = ({ component: Component, staticContext, ...rest }) => (
    <Route {...rest} render={(props) => (<Component {...props}
      staticContext={staticContext} />)} />), App =
({ staticContext }) => {
  if (!staticContext) staticContext = window.__INITIAL_DATA__;
  let { config } = staticContext,
    { description, keywords, siteName, iconUrl } = config;
  return <div>
    <Metamorph title={siteName || 'My Website'}
      description={description || 'Welcome to my website!'}
      keywords={keywords && keywords.join(',') || ''} image={iconUrl || ''}/>
    <FrontHeader staticContext={staticContext} />
    <Switch>
      <FrontEndRoute exact path='/' staticContext={staticContext}
        component={HomePage} />
      <ProtectedRoute exact path='/admin' isAdmin={false}
        staticContext={staticContext} component={() => <div />}/>
      <ProtectedRoute exact path='/admin/new/:docTypeId' isAdmin={false}
        staticContext={staticContext} component={EditDocumentPage} />
      <ProtectedRoute exact path='/admin/edit/:docType' isAdmin={true}
        staticContext={staticContext} component={EditDocumentLanding} />
      <ProtectedRoute exact path='/admin/edit-document/:docNode' isAdmin={false}
        staticContext={staticContext} component={EditDocumentPage}/>
      <ProtectedRoute exact path='/admin/edit-template/:docTypeId'
        staticContext={staticContext} isAdmin={false}
        component={EditDisplayTemplate} />
      <ProtectedRoute exact path='/admin/edit-type/:docTypeId' isAdmin={false}
        staticContext={staticContext} component={EditDocType}/>
      <LoggedOutRoute path="/signup" staticContext={staticContext}
        component={SignupPage} />
      <LoggedOutRoute path="/login" staticContext={staticContext}
        component={LoginPage} />
      <ProtectedRoute exact path="/admin/edit-profile" isAdmin={false}
        staticContext={staticContext} component={ProfileEditPage} />
      <ProtectedRoute exact path="/admin/edit-config" isAdmin={true}
        staticContext={staticContext} component={ConfigPage} />
      <ProtectedRoute exact path="/admin/register-type" isAdmin={true}
        staticContext={staticContext} component={EditDocType} />
      <ProtectedRoute exact path='/admin/change-password' isAdmin={false}
        staticContext={staticContext} component={ChangePasswordPage} />
      <ProtectedRoute exact path='/admin/file-mgmt' isAdmin={false}
        staticContext={staticContext} component={FileMgmtLanding} />
      <ProtectedRoute exact path='/admin/upload-file' isAdmin={false}
        staticContext={staticContext} component={UploadFilePage} />
      <FrontEndRoute exact path="/not-found" component={NotFound}
        staticContext={staticContext} />
      <FrontEndRoute exact path="/profile/:username"
        component={FrontProfileDisplay} staticContext={staticContext} />
      <FrontEndRoute exact path="/:docType" component={FrontCategoryDisplay}
        staticContext={staticContext} />
      <FrontEndRoute exact path="/:docType/:docNode"
        component={FrontDocumentDisplay} staticContext={staticContext} />
      <Route path="*" component={NotFound} />
    </Switch>
    <Footer user={staticContext.user || null} />
  </div>;
}

[ProtectedRoute, LoggedOutRoute, FrontEndRoute].forEach((comp) => {
  if (!comp.propTypes) comp.propTypes = {
    staticContext: object, component: func
  };
});

ProtectedRoute.propTypes.isAdmin = bool;

App.propTypes = { staticContext: object }

export default App;
