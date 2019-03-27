import React, { Component } from 'react';
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
import { default as urlUtils } from '../utils';

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
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { user: undefined, config: undefined, canDisplay: false };
  }

  componentDidMount() {
    axios.get(
      urlUtils.serverInfo.path('/api/users/get'), { withCredentials: true })
      .then((res) => res.data)
      .then(data => { this.setState({ user: data, canDisplay: true }); })
      .catch((err) => {
        console.log(err);
        console.log('User not logged in.');
        this.setState({ user: null, canDisplay: true });
      });

    axios.get(
      urlUtils.serverInfo.path('/api/site_config/get'),
      { withCredentials: true })
      .then((res) => res.data)
      .then(data => { this.setState({ config: data }); })
      .catch((err) => {
        console.log(err);
        console.log('Couldn\'t get site config.');
        this.setState({ config: null, canDisplay: true });
      });

    axios.get(
      urlUtils.serverInfo.path('/api/documents/get_types'),
      { withCredentials: true
      }).then((res) => res.data).then(data => {
      console.log(data);
      this.setState({ docTypes: data, canDisplay: true });
    }).catch((err) => {
      console.log(err);
      console.log('Couldn\'t get document types.');
      this.setState({ docTypes: [], canDisplay: true });
    });
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
