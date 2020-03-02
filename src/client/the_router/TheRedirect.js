import useTheRouterContext from '../hooks/useTheRouterContext';

export default function Redirect({ to }) {
  let { history } = useTheRouterContext();

  history.replace(to);

  return null;
}
