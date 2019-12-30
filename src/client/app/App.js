import React, { useContext } from 'react';
import TheRedirect from '../the_router/TheRedirect';
import { MainMenu } from '../views/admin';
import { loggedOutRoutes, backEndRoutes, frontEndRoutes }
  from '../../lib/routes/route_data';
import { FrontHeader } from '../views/front';
import Fedora from '../reusables/Fedora';
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

let ProtectedRoute = ({ component: Component, isAdmin, ...rest
}) => <TheRoute {...rest} component={({ history, match }) => {
  let { staticContext } = useContext(StaticContext);

  if (staticContext.user) {
    if ((isAdmin && staticContext.user.roleId === 0) || !isAdmin) {
      return <TheProvider {...{ history, match, component: () => [
        <MainMenu />, <Component />] }} />;
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

let mapRoutes = (Component) => (routeInfo) => <Component {...routeInfo} />;

let App = () => {
  let { staticContext } = useContext(StaticContext);
  let { config } = staticContext,
    { description, keywords, siteName, iconUrl } = config;
  return <div>
    <Fedora title={siteName || 'My Website'} description={description ||
      'Welcome to my website!'} keywords={keywords && keywords.join(',') || ''}
    image={iconUrl || ''} />
    <TheSwitch>
      <FrontEndRoute path='*' component={FrontHeader}/>
    </TheSwitch>
    <TheSwitch>
      {backEndRoutes.map(mapRoutes(ProtectedRoute))}
      {loggedOutRoutes.map(mapRoutes(LoggedOutRoute))}
      {frontEndRoutes.map(mapRoutes(FrontEndRoute))}
    </TheSwitch>
  </div>;
};

export default App;
