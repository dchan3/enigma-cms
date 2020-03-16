import { h } from 'preact';
import frontEndRoutes from '../../lib/routes/front_routes';
import { FrontHeader } from '../views/front';
import { Fedora } from '../reusables/front_exports';
import useStaticContext from '../hooks/useStaticContext';
import { TheRoute, TheSwitch } from '../the_router';

/** @jsx h **/
let FrontEndRoute = props => <TheRoute {...props} />;

let mapRoutes = (Component) => (routeInfo) => <Component {...routeInfo} />;

export default function App() {
  let { config: { description, keywords, siteName, iconUrl } } = useStaticContext(['config']);
  return [
    <Fedora title={siteName} description={description}
      keywords={keywords && keywords.join(',') || ''} image={iconUrl} />,
    <TheSwitch>
      <FrontEndRoute path='*' component={FrontHeader}/>
    </TheSwitch>,
    <TheSwitch>
      {frontEndRoutes.map(mapRoutes(FrontEndRoute))}
    </TheSwitch>,
  ];
}
