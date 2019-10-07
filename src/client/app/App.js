import React, { useContext } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import {
  ChangePasswordPage, ConfigPage, EditDisplayTemplate,
  EditDocumentLanding, EditDocumentPage, FileMgmtLanding,
  ProfileEditPage, SignupPage, EditDocType, UploadFilePage, MainMenu
} from '../views/admin';
import { FrontCategoryDisplay, FrontDocumentDisplay, FrontHeader,
  FrontProfileDisplay, LoginPage, SearchPage } from '../views/front';
import { Footer } from '../reusables';
import { Metamorph } from 'react-metamorph';
import { GeneralContextProvider } from '../contexts/GeneralContext';
import StaticContext from '../contexts/StaticContext';

let TheProvider = ({ component: Component, history, match }) => (
  <GeneralContextProvider initialVals={{ history, match }}><Component />
  </GeneralContextProvider>);

let FrontEndRoute = ({ component, ...rest }) => <Route
  exact {...rest} component={({ history, match }) => (
    <TheProvider {...{ history, match, component }} />)} />;

let ProtectedRoute = ({ component, isAdmin, ...rest
}) => <Route exact {...rest} component={({ history, match }) => {
  let { staticContext } = useContext(StaticContext);

  if (staticContext.user) {
    if ((isAdmin && staticContext.user.roleId === 0) || !isAdmin) {
      return <TheProvider {...{ history, match, component }} />;
    }
    else return <Redirect to="/admin" />;
  }
  else return <Redirect to="/login" />;
}} />;

let LoggedOutRoute = ({ component, ...rest }) => <Route exact {...rest}
  component={({ history, match }) => {
    let { staticContext } = useContext(StaticContext);
    return staticContext.user ? <Redirect to="/admin" /> :
      <TheProvider {...{ history, match, component }} />;
  }} />

let UniversalRoute =
  ({ component, ...rest }) => <Route exact {...rest} component={({ history,
    match }) => <TheProvider {...{ history, match, component }} />} />;

let App = () => {
  let { staticContext } = useContext(StaticContext);
  let { config } = staticContext,
    { description, keywords, siteName, iconUrl } = config;
  return <div>
    <Metamorph title={siteName || 'My Website'} description={description ||
      'Welcome to my website!'} keywords={keywords && keywords.join(',') || ''}
    image={iconUrl || ''}/>
    <Switch>
      <ProtectedRoute path='/admin' component={MainMenu} isAdmin={false} />
      <FrontEndRoute path='*' component={FrontHeader}/>
    </Switch>
    <Switch>
      <ProtectedRoute path="/admin/edit-profile" isAdmin={false}
        component={ProfileEditPage} />
      <ProtectedRoute path="/admin/edit-config" isAdmin={true}
        component={ConfigPage} />
      <ProtectedRoute path="/admin/register-type" isAdmin={true}
        component={EditDocType} />
      <ProtectedRoute path='/admin/change-password' isAdmin={false}
        component={ChangePasswordPage} />
      <ProtectedRoute path='/admin/file-mgmt' isAdmin={false}
        component={FileMgmtLanding} />
      <ProtectedRoute path='/admin/upload-file' isAdmin={false}
        component={UploadFilePage} />
      <ProtectedRoute path='/admin/new/:docTypeId' isAdmin={false}
        component={EditDocumentPage} />
      <ProtectedRoute path='/admin/edit/:docType' isAdmin={true}
        component={EditDocumentLanding} />
      <ProtectedRoute path='/admin/edit-document/:docNode' isAdmin={false}
        component={EditDocumentPage}/>
      <ProtectedRoute path='/admin/edit-template/:docTypeId' isAdmin={false}
        component={EditDisplayTemplate} />
      <ProtectedRoute path='/admin/edit-type/:docTypeId' isAdmin={false}
        component={EditDocType}/>
      <ProtectedRoute path='/admin' isAdmin={false} component={() => <div />}/>
      <LoggedOutRoute path="/signup" component={SignupPage} />
      <LoggedOutRoute path="/login" component={LoginPage} />
      <LoggedOutRoute path="/search" component={SearchPage} />
      <FrontEndRoute path="/not-found" component={() => <div>
        <h1>Not Found</h1>
        <p>We're sorry, but the page you requested could not be found.</p>
      </div>} />
      <FrontEndRoute path="/profile/:username"
        component={FrontProfileDisplay} />
      <FrontEndRoute path="/:docType/:docNode"
        component={FrontDocumentDisplay} />
      <FrontEndRoute path="/:docType" component={FrontCategoryDisplay} />
      <FrontEndRoute path='/' component={() => <div />} />
    </Switch>
    <Switch>
      <UniversalRoute path="*" component={Footer} />
    </Switch>
  </div>;
};

export default App;
