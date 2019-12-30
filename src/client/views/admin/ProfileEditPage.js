import React from 'react';
import { GeneratedForm, AdminFrame } from '../../reusables';
import useStaticContext from '../../hooks/useStaticContext.js';

function ProfileEditPage() {
  let { user } = useStaticContext(['user']);

  return <AdminFrame><GeneratedForm title='Edit Profile' currentValue={user}
    params={{
      userId: { label: 'User ID', type: 'text', hidden: true },
      username: { type: 'text' }, displayName: { type: 'text' },
      profilePhoto: { type: 'file' }, currentPassword: { type: 'password' },
      fileContent: { type: 'string', hidden: true }, email: { type: 'email' },
      bio: { type: 'text', grammar: 'html' }
    }} redirectUrl='/admin' formAction='users/update' /></AdminFrame>;
}

export default ProfileEditPage;
