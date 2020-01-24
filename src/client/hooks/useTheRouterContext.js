import { useContext } from 'preact/hooks';
import TheRouterContext from '../contexts/TheRouterContext';

export default function useTheRouterContext() {
  return useContext(TheRouterContext);
}
