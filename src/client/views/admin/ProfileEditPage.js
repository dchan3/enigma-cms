import React from 'react';
import { object } from 'prop-types';
import { GeneratedForm } from '../../reusables';

function ProfileEditPage({ staticContext }) {
  let { user } = staticContext;
  return <GeneratedForm title='Edit Profile'
    params={{
      userId: {
        label: 'User ID',
        type: 'text',
        value: user._id,
        hidden: true
      },
      username: {
        type: 'text',
        value: user.username
      },
      displayName: {
        type: 'text',
        value: user.displayName || ''
      },
      profilePhoto: {
        type: 'file'
      },
      fileContent: {
        type: 'string',
        hidden: true
      },
      email: {
        type: 'email',
        value: user.email
      },
      currentPassword: {
        type: 'password'
      }
    }} method="post" redirectUrl='/admin' formAction='/api/users/update' />;
}

ProfileEditPage.propTypes = {
  staticContext: object
};

export default ProfileEditPage;
