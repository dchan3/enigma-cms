import React, { Component } from 'react';
import { object } from 'prop-types';
import GeneratedForm from '../../reusables/GeneratedForm';

class ProfileEditPage extends Component {
  static propTypes = {
    staticContext: object
  };

  render() {
    let { user } = this.props.staticContext;
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
}

export default ProfileEditPage;
