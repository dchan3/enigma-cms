import useTheRouterContext from '../hooks/useTheRouterContext';

export default function Redirect({ to }) {
  let { history, setLocation } = useTheRouterContext();

  history.replace(to);
  setLocation(history.location);

  return null;
}
