import React from 'react';
import { GeneratedForm } from '../../reusables';
import useStaticContext from '../../hooks/useStaticContext.js';

function ProfileEditPage() {
  let { user } = useStaticContext(['user']);

  return <GeneratedForm title='Edit Profile' currentValue={user} params={{
    userId: { label: 'User ID', type: 'text', hidden: true },
    username: { type: 'text' }, displayName: { type: 'text' },
    profilePhoto: { type: 'file' }, currentPassword: { type: 'password' },
    fileContent: { type: 'string', hidden: true }, email: { type: 'email' },
  }} method="post" redirectUrl='/admin' formAction='/api/users/update' />;
}

export default ProfileEditPage;
