import { useContext } from 'preact/hooks';
import StaticContext from '../contexts/StaticContext';

export default function useStaticContext() {
  return useContext(StaticContext).staticContext;
}
