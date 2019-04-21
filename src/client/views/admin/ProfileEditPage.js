import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GeneratedForm from '../../reusables/GeneratedForm';

class ProfileEditPage extends Component {
  static propTypes = {
    staticContext: PropTypes.object
  };

  redirect() {
    window.location.href = '/admin';
  }

  render() {
    let user = this.props.staticContext.user;
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
      }} method="post" successCallback={this.redirect}
      formAction='/api/users/update' />;
  }
}

export default ProfileEditPage;
