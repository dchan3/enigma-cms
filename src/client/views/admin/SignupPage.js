import React from 'react';
import { GeneratedForm, StyledDiv, SamePageAnchor } from '../../reusables';

export default () => [<GeneratedForm title="Sign Up" params={{
  username: { type: 'text', maximum: 20, required: true },
  email: { type: 'email', required: true },
  password: { type: 'password', required: true }
}} formAction='users/register' redirectUrl='/admin' />,
<StyledDiv><p>Have an account? Sign in <SamePageAnchor href="/login">
  here</SamePageAnchor>.</p>
</StyledDiv>];
