import { useContext } from 'react';
import TheRouterContext from '../contexts/TheRouterContext';

export default function Redirect({ to }) {
  let { history, setLocation } = useContext(TheRouterContext);

  history.replace(to);
  setLocation(history.location);

  return null;
}
