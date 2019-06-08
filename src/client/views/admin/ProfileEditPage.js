import React from 'react';
import { object } from 'prop-types';
import { GeneratedForm } from '../../reusables';

function ProfileEditPage({ staticContext: { user } }) {
  return <GeneratedForm title='Edit Profile' currentValue={user} params={{
    userId: { label: 'User ID', type: 'text', hidden: true },
    username: { type: 'text' }, displayName: { type: 'text' },
    profilePhoto: { type: 'file' }, currentPassword: { type: 'password' },
    fileContent: { type: 'string', hidden: true }, email: { type: 'email' },
  }} method="post" redirectUrl='/admin' formAction='/api/users/update' />;
}

ProfileEditPage.propTypes = {
  staticContext: object
};

export default ProfileEditPage;
