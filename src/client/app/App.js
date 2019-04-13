import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router';
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
import Footer from '../reusables/Footer';

var ProtectedRoute = function({ component: Component, isAdmin, staticContext,
  ...rest }) {
  return <Route {...rest} render={(props) => {
    if (staticContext.user) {
      if ((isAdmin && staticContext.user.roleId === 0) || !isAdmin) {
        return <Component {...props} staticContext={staticContext} />
      }
      else return <Redirect to="/login" />
    }
    else return <Redirect to="/login" />
  }} />
};

ProtectedRoute.propTypes = {
  isAdmin: PropTypes.bool,
  staticContext: PropTypes.object,
  component: PropTypes.func
};

var LoggedOutRoute = function({ component: Component, staticContext,
  ...rest }) {
  return <Route {...rest} render={(props) => {
    if (staticContext.user) {
      return <Redirect to="/admin" />
    }
    else return <Component {...props} />
  }} />
};

LoggedOutRoute.propTypes = {
  staticContext: PropTypes.object,
  component: PropTypes.func
}

class App extends Component {
  static propTypes = {
    staticContext: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.returnComp = this.returnComp.bind(this);
  }

  returnComp(Comp) {
    var staticComp = this.props.staticContext || window.__INITIAL_DATA__;
    return class extends Component {
      render() {
        return <Comp staticContext={staticComp} />
      }
    };
  }

  render() {
    var staticContext = this.props.staticContext || window.__INITIAL_DATA__;
    return [
      (staticContext.config && staticContext.docTypes && staticContext.user) ?
        <MainMenu staticContext={staticContext} /> : null,
      staticContext.config ?
        <style>{staticContext.config.stylesheet}</style> : null,
      <Route exact path='/' component={this.returnComp(HomePage)} />,
      <ProtectedRoute path="/admin" isAdmin={false}
        staticContext={staticContext} component={MainMenu} />,
      <ProtectedRoute exact path="/admin/edit-profile" isAdmin={false}
        staticContext={staticContext} component={ProfileEditPage} />,
      <ProtectedRoute exact path="/admin/config" isAdmin={true}
        staticContext={staticContext}  component={ConfigPage} />,
      <ProtectedRoute exact path="/admin/register-type" isAdmin={true}
        staticContext={staticContext}  component={RegisterDocType} />,
      <ProtectedRoute exact path='/admin/new/:docTypeId' isAdmin={false}
        staticContext={staticContext}  component={DocumentEditPage} />,
      <ProtectedRoute exact path='/admin/edit/:docType'
        staticContext={staticContext}  component={EditDocumentLanding} />,
      <ProtectedRoute exact path='/admin/edit-document/:docNode'
        staticContext={staticContext} isAdmin={false}
        component={DocumentUpdatePage}/>,
      <ProtectedRoute exact path='/admin/edit-template/:docTypeId'
        staticContext={staticContext} isAdmin={false}
        component={EditDisplayTemplate}/>,
      <ProtectedRoute exact path='/admin/edit-type/:docTypeId'
        staticContext={staticContext} isAdmin={false}
        component={UpdateDocType}/>,
      <ProtectedRoute exact path='/admin/change-password' isAdmin={false}
        staticContext={staticContext} component={ChangePasswordPage} />,
      <LoggedOutRoute path="/signup" staticContext={staticContext}
        component={SignupPage} />,
      <LoggedOutRoute path="/login" staticContext={staticContext}
        component={LoginPage} />,
      <Route exact path="/profile/:username"
        component={this.returnComp(FrontProfileDisplay)} />,
      <Route path="/:docType/:docNode" component={FrontDocumentDisplay} />,
      <Route path="/not-found" component={NotFound} />,
      <Footer user={staticContext.user || null} />
    ];
  }
}

export default App;
