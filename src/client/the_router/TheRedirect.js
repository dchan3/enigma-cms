import useTheRouterContext from '../hooks/useTheRouterContext';

export default function Redirect({ to }) {
  let { history, setHistory } = useTheRouterContext();

  history.replace(to.replace(/^\//, ''));
  setHistory(history);

  return null;
}
