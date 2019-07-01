import React from 'react';
import { GeneratedForm, StyledDiv } from '../../reusables';

export default () => [<GeneratedForm title="Sign Up" params={{
  username: { type: 'text', maximum: 20, required: true },
  email: { type: 'email', required: true },
  password: { type: 'password', required: true }
}} method="post" formAction='/api/users/register' redirectUrl='/admin' />,
<StyledDiv><p>Have an account? Sign in <a href="/login">here</a>.</p>
</StyledDiv>];
