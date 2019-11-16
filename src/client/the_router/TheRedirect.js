import { useContext } from 'react';
import TheRouterContext from '../contexts/TheRouterContext';

export default function Redirect({ to }) {
  let { history } = useContext(TheRouterContext);

  history.replace(to);

  return null;
}
