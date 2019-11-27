import React, { useContext } from 'react';
import TheRedirect from '../the_router/TheRedirect';
import { MainMenu } from '../views/admin';
import { loggedOutRoutes, backEndRoutes, frontEndRoutes }
  from '../../lib/routes/route_data';
import { FrontHeader } from '../views/front';
import { Footer } from '../reusables';
import { Metamorph } from 'react-metamorph';
import { GeneralContextProvider } from '../contexts/GeneralContext';
import StaticContext from '../contexts/StaticContext';
import TheRoute from '../the_router/TheRoute';
import TheSwitch from '../the_router/TheSwitch';

let TheProvider = ({ component: Component, history, match }) => (
  <GeneralContextProvider initialVals={{ history, match }}><Component />
  </GeneralContextProvider>);

let FrontEndRoute = ({ component, ...rest }) => <TheRoute {...rest}
  component={({ history, match }) => (
    <TheProvider {...{ history, match, component }} />)} />;

let ProtectedRoute = ({ component, isAdmin, ...rest
}) => <TheRoute {...rest} component={({ history, match }) => {
  let { staticContext } = useContext(StaticContext);

  if (staticContext.user) {
    if ((isAdmin && staticContext.user.roleId === 0) || !isAdmin) {
      return <TheProvider {...{ history, match, component }} />;
    }
    else return <TheRedirect to="/admin" />;
  }
  else return <TheRedirect to="/login" />;
}} />;

let LoggedOutRoute = ({ component, ...rest }) => <TheRoute exact {...rest}
  component={({ history, match }) => {
    let { staticContext } = useContext(StaticContext);
    return staticContext.user ? <TheRedirect to="/admin" /> :
      <TheProvider {...{ history, match, component }} />;
  }} />;

let UniversalRoute =
  ({ component, ...rest }) => <TheRoute exact {...rest} component={({ history,
    match }) => <TheProvider {...{ history, match, component }} />} />;

let App = () => {
  let { staticContext } = useContext(StaticContext);
  let { config } = staticContext,
    { description, keywords, siteName, iconUrl } = config;
  return <div>
    <Metamorph title={siteName || 'My Website'} description={description ||
      'Welcome to my website!'} keywords={keywords && keywords.join(',') || ''}
    image={iconUrl || ''}/>
    <TheSwitch>
      <ProtectedRoute path='/admin' component={MainMenu} isAdmin={false} />
      <FrontEndRoute path='*' component={FrontHeader}/>
    </TheSwitch>
    <TheSwitch>
      {backEndRoutes.map(({ path, isAdmin, component: Component }) => (
        <ProtectedRoute {...{ path, isAdmin, component: () => <div style={{
          width: '90%',
          display: 'inline-block',
          height: '100vh',
          overflowY: 'scroll'
        }}><Component /></div> }} />))}
      {loggedOutRoutes.map(({ path, component }) => (
        <LoggedOutRoute {...{ path, component }} />))}
      {frontEndRoutes.map(({ path, component }) => (
        <FrontEndRoute {...{ path, component }} />))}
    </TheSwitch>
    <TheSwitch>
      <UniversalRoute path="*" component={Footer} />
    </TheSwitch>
  </div>;
};

export default App;
