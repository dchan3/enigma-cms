import React, { useContext } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { MainMenu } from '../views/admin';
import { loggedOutRoutes, backEndRoutes, frontEndRoutes }
  from '../../lib/routes/route_data';
import { FrontHeader } from '../views/front';
import { Footer } from '../reusables';
import { Metamorph } from 'react-metamorph';
import { GeneralContextProvider } from '../contexts/GeneralContext';
import StaticContext from '../contexts/StaticContext';

let TheProvider = ({ component: Component, history, match }) => (
  <GeneralContextProvider initialVals={{ history, match }}><Component />
  </GeneralContextProvider>);

let FrontEndRoute = ({ component, ...rest }) => <Route exact {...rest}
  component={({ history, match }) => (
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
      {backEndRoutes.map(({ path, isAdmin, component }) => (
        <ProtectedRoute {...{ path, isAdmin, component }} />))}
      {loggedOutRoutes.map(({ path, component }) => (
        <LoggedOutRoute {...{ path, component }} />))}
      {frontEndRoutes.map(({ path, component }) => (
        <FrontEndRoute {...{ path, component }} />))}
    </Switch>
    <Switch>
      <UniversalRoute path="*" component={Footer} />
    </Switch>
  </div>;
};

export default App;
