import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { default as urlUtils } from '../utils';

var FooterContainer = styled.div`
  text-align: center;
  font-family: sans-serif;
  margin: 10px;
`, FooterText = styled.p`
  margin: 0;
`;

class Footer extends Component {
  static propTypes  = {
    user: PropTypes.object
  }

  render() {
    return <FooterContainer>
      <FooterText>Powered by <a href="https://github.com/dchan3/enigma-cms">
        Enigma CMS</a>.</FooterText>
      {!!this.props.user ? <FooterText>
        Logged in as {this.props.user.username}.{' '}
        <a href=
          {urlUtils.clientInfo.path('/admin/edit_profile')}>Edit profile</a>.
        {' '}
        <a href={urlUtils.serverInfo.path('/api/users/logout')}>Logout</a>.
        {' '}
        <a href='/change_password'>Change password.</a>.
      </FooterText> : <FooterText>
        <a href="/login">Login</a>
        {' | '}
        <a href="/signup">Register</a>
      </FooterText>}
    </FooterContainer>;
  }
}

export default Footer;
