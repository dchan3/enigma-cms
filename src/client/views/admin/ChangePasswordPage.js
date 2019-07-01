import React from 'react';
import { object } from 'prop-types';
import GeneratedForm from '../../reusables/GeneratedForm';

function ChangePasswordPage({ user: { _id } }) {
  return <GeneratedForm title="Change Password" params={{
    userId: {
      label: 'User ID',
      type: 'text',
      value: _id,
      hidden: true
    },
    currentPassword: { type: 'password' },
    newPassword: { type: 'password' }
  }} method="post" formAction='/api/users/change_password' redirectUrl='/admin'
  />;
}

ChangePasswordPage.propTypes = {
  user: object
};

export default ChangePasswordPage;
