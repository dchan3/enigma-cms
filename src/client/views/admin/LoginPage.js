import { h } from 'preact'; /** @jsx h **/
import { GeneratedForm, StyledDiv, SamePageAnchor, Fedora } from '../../reusables/back_exports';
import useStaticContext from '../../hooks/useStaticContext';

function LoginPage() {
  let { config: { siteName } } = useStaticContext(['config']);

  return [<Fedora title={`Sign In | ${siteName}`}
    description={`Sign into ${siteName}`} />,<GeneratedForm title="Sign In" params={{
    username: { label: 'Username or Email', type: 'text', required: true },
    password: { type: 'password', required: true }
  }} formAction='users/login' redirectUrl='/admin' />,
  <StyledDiv>
    <p>Don't have an account? Sign up <SamePageAnchor href="/signup">
    here</SamePageAnchor>.</p>
  </StyledDiv>];
}

export default LoginPage;
