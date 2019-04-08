import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
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
import Footer from '../reusables/Footer';
import axios from 'axios';
import fetch from 'isomorphic-fetch';
import { default as urlUtils } from '../../lib/utils';

const ProtectedRoute = function({ component: Component, user, isAdmin,
  ...rest }) {
  return <Route {...rest} render={(props) => {
    if (!!user) {
      if ((isAdmin && user.roleId === 0) || !isAdmin) {
        return  <Component {...props} />
      }
      else return <Redirect to="/login" />
    }
    else return <Redirect to="/login" />
  }} />
};

const LoggedOutRoute = function({ component: Component, user, ...rest }) {
  return <Route {...rest} render={(props) => {
    if (user) {
      return <Redirect to="/admin" />
    }
    else return <Component {...props} />
  }} />
};

class App extends Component {
  static propTypes = {
    user: PropTypes.any,
    config: PropTypes.object,
    types: PropTypes.array
  }

  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      config: this.props.config || undefined,
      types: this.props.types || undefined,
      canDisplay: false };
  }

  async componentDidMount() {
    var self = this;
    if (!this.props.config && !this.props.types) {
      var config =
        await fetch(urlUtils.info.path('/api/site_config/get'));
      var configData = await config.json();

      var types =
        await fetch(urlUtils.info.path('/api/documents/get_types'));
      var typesData = await types.json();

      var user =
        await fetch(urlUtils.info.path('/api/users/get'));
      var userData = await user.json();

      self.setState({ user: userData, types: typesData, config: configData,
        canDisplay: true });
    }
    else self.setState({ canDisplay: true });
  }

  render() {
    if (this.state.canDisplay) return [
      (!!this.state.config && !!this.state.docTypes && !!this.state.user) ?
        <MainMenu config={this.state.config}
          user={this.state.user} docTypes={this.state.docTypes} /> : null,
      !!this.state.config ?
        <style>{this.state.config.stylesheet}</style> : null,
      <Router>
        <Switch>
          <Route exact path='/' component={() =>
            <HomePage user={this.state.user || null}
              config={this.state.config || null} /> } />
          <ProtectedRoute exact path="/admin/edit_profile"
            user={this.state.user} isAdmin={false}
            component={() => <ProfileEditPage user={this.state.user} />} />
          <ProtectedRoute exact path="/admin/config" isAdmin={true}
            user={this.state.user} component={() =>
              <ConfigPage config={this.state.config} />} />,
          <ProtectedRoute exact path="/admin/register_type" isAdmin={true}
            user={this.state.user} component={RegisterDocType} />
          <ProtectedRoute exact path='/admin/new/:docTypeId' isAdmin={false}
            user={this.state.user} component={DocumentEditPage} />
          <ProtectedRoute exact path='/admin/edit/:docType'
            user={this.state.user}
            component={({ match }) => (<EditDocumentLanding match={match}
              config={this.state.config} />)} />
          <ProtectedRoute exact path='/admin/edit_document/:docNode'
            isAdmin={false} user={this.state.user}
            component={DocumentUpdatePage}/>
          <ProtectedRoute exact path='/admin/edit_template/:docTypeId'
            isAdmin={false} user={this.state.user}
            component={EditDisplayTemplate}/>
          <ProtectedRoute exact path='/admin/edit_type/:docTypeId'
            isAdmin={false} user={this.state.user} component={UpdateDocType}/>
          <ProtectedRoute exact path='/change_password' user={this.state.user}
            isAdmin={false}
            component={() => <ChangePasswordPage user={this.state.user} />} />
          <ProtectedRoute exact path="/admin/" isAdmin={false}
            user={this.state.user} component={() => <div />} />
          <LoggedOutRoute path="/signup" component={SignupPage}
            user={this.state.user} />
          <LoggedOutRoute user={this.state.user} path="/login"
            component={LoginPage} />,
          {!!this.state.config ?
            <Route exact path="/profile/:username" component={({ match }) =>
              <FrontProfileDisplay config={this.state.config}
                match={match} />} /> : null}
          {!!this.state.config ?
            <Route path="/:docType/:docNode" component={({ match }) =>
              <FrontDocumentDisplay config={this.state.config}
                match={match} />} /> : null}
          <Route path="*" component={NotFound} />
        </Switch>
      </Router>,
      <Footer user={this.state.user || null} />
    ];
    else return null;
  }
}

export default App;
