import { h } from 'preact'; /** @jsx h **/
import useStaticContext from '../../hooks/useStaticContext';

export default function AdminLanding() {
  let { user: { username } } = useStaticContext(['user']);

  return <h1>Welcome, {username}.</h1>;
}
