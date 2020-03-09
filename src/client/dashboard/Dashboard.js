import { h } from 'preact';
import { MainMenu } from '../views/admin';
import backEndRoutes from '../../lib/routes/route_data';
import { LoginPage, SignupPage } from '../../client/views/admin';
import { Fedora, AdminFrame, AdminContainer } from '../reusables/back_exports';
import { TheRoute, TheSwitch, TheRedirect } from '../the_router';
import useStaticContext from '../hooks/useStaticContext';

/** @jsx h **/

let ProtectedRoute = ({ component: Component, isAdmin, ...rest
}) => <TheRoute {...rest} component={() => {
  let { user } = useStaticContext(['user']);

  if (user) {
    if ((isAdmin && user.roleId === 0) || !isAdmin) {
      return <AdminContainer><Component /></AdminContainer>;
    }
  }
  return <TheRedirect to="/login" />;
}} />;

let mapRoutes = (Component) => (routeInfo) => <Component {...routeInfo} />;

let Dashboard = () => {
  let { config: { description, keywords, siteName, iconUrl } } = useStaticContext(['config']);
  return <div>
    <Fedora title={siteName || 'My Website'} description={description ||
      'Welcome to my website!'} keywords={keywords && keywords.join(',') || ''}
    image={iconUrl || ''} />
    <AdminFrame>
      <TheRoute path="/admin" component={MainMenu} exact={false} />
      <TheSwitch>
        {backEndRoutes.map(mapRoutes(ProtectedRoute))}
        <TheRoute path="/login" component={LoginPage} />
        <TheRoute path="/signup" component={SignupPage} />
        <TheRoute path="*" component={() => <div><h1>NOT FOUND</h1></div>} />
      </TheSwitch>
    </AdminFrame>
  </div>;
};

export default Dashboard;
