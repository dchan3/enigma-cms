import { h } from 'preact'; /** @jsx h **/
import { GeneratedForm } from '../../reusables/back_exports';
import useStaticContext from '../../hooks/useStaticContext';

export default function ChangePasswordPage() {
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
