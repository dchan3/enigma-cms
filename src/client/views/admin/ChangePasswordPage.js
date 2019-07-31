import React, { useContext } from 'react';
import GeneratedForm from '../../reusables/GeneratedForm';
import GeneralContext from '../../contexts/GeneralContext';

function ChangePasswordPage() {
  let { generalState } = useContext(GeneralContext),
    { staticContext } = generalState, { user: { _id } } = staticContext;

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

export default ChangePasswordPage;
