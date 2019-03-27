import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GeneratedForm from '../reusables/GeneratedForm';
import { default as urlUtils } from '../utils';

class ProfileEditPage extends Component {
  static propTypes = {
    user: PropTypes.object
  };

  redirect() {
    window.location.href = '/admin';
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
          type: 'text',
          value: this.props.user.username
        },
        displayName: {
          type: 'text',
          value: this.props.user.displayName || ''
        },
        email: {
          type: 'email',
          value: this.props.user.email
        },
        currentPassword: {
          type: 'password'
        }
      }} method="post" successCallback={this.redirect}
      formAction={urlUtils.serverInfo.path('/api/users/update')} />;
  }
}

export default ProfileEditPage;
