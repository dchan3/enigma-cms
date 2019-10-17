import React from 'react';
import GeneratedForm from '../../reusables/GeneratedForm';
import useStaticContext from '../../hooks/useStaticContext';

function ChangePasswordPage() {
  let { user: { _id } } = useStaticContext(['user']);

  return <GeneratedForm title="Change Password" params={{
    userId: {
      label: 'User ID',
      type: 'text',
      value: _id,
      hidden: true
    },
    currentPassword: { type: 'password' },
    newPassword: { type: 'password' }
  }} formAction='users/change_password' redirectUrl='/admin'
  />;
}

export default ChangePasswordPage;
