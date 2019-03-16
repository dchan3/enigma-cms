import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GeneratedForm from '../reusables/GeneratedForm';
import { default as urlUtils } from '../utils';

class ProfileEditPage extends Component {
  static propTypes = {
    user: PropTypes.object
  }

  render() {
    return <GeneratedForm title='Edit Profile'
      params={{
        userId: {
          label: 'User ID',
          type: 'text',
          value: this.props.user._id,
          hidden: true
        },
        username: {
          label: 'Username',
          type: 'text',
          value: this.props.user.username
        },
        email: {
          label: 'Email',
          type: 'email',
          value: this.props.user.email
        },
        currentPassword: {
          label: 'Enter Current Password',
          type: 'password'
        }
      }} method="post"
      formAction={urlUtils.serverInfo.path('/api/users/update')} />;
  }
}

export default ProfileEditPage;
