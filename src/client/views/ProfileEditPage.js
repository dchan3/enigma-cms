import React, { Component } from 'react';
import GeneratedForm from '../reusables/GeneratedForm';
import { default as urlUtils } from '../../lib/utils';

class ProfileEditPage extends Component {
  redirect() {
    window.location.href = '/admin';
  }

  render() {
    return <GeneratedForm title='Edit Profile'
      params={{
        userId: {
          label: 'User ID',
          type: 'text',
          value: global.user._id,
          hidden: true
        },
        username: {
          type: 'text',
          value: global.user.username
        },
        displayName: {
          type: 'text',
          value: global.user.displayName || ''
        },
        email: {
          type: 'email',
          value: global.user.email
        },
        currentPassword: {
          type: 'password'
        }
      }} method="post" successCallback={this.redirect}
      formAction={urlUtils.info.path('/api/users/update')} />;
  }
}

export default ProfileEditPage;
