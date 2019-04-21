import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GeneratedForm from '../../reusables/GeneratedForm';

class ChangePasswordPage extends Component {
  static propTypes = {
    user: PropTypes.object
  };

  redirectToAdmin() {
    window.location.href = '/admin';
  }

  render() {
    return <GeneratedForm title="Change Password" params={{
      userId: {
        label: 'User ID',
        type: 'text',
        value: this.props.user._id,
        hidden: true
      },
      currentPassword: {
        type: 'password'
      },
      newPassword: {
        type: 'password'
      }
    }} method="post" formAction='/api/users/change_password'
    successCallback={this.redirectToAdmin} />;
  }
}

export default ChangePasswordPage;
