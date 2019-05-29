import React, { Component } from 'react';
import { object } from 'prop-types';
import styled from 'styled-components';

var FooterContainer = styled.div`
  text-align: center;
  font-family: sans-serif;
  margin: 10px;
`, FooterText = styled.p`
  margin: 0;
`;

class Footer extends Component {
  static propTypes  = {
    user: object
  };

  render() {
    return <FooterContainer>
      <FooterText>Powered by <a href="https://github.com/dchan3/enigma-cms">
        Enigma CMS</a>.</FooterText>
      {this.props.user ? <FooterText>
        Logged in as {this.props.user.username}.{' '}
        <a href='/admin/edit-profile'>Edit profile</a>.
        {' '}
        <a href='/api/users/logout'>Logout</a>.
        {' '}
        <a href='/change-password'>Change password</a>.
      </FooterText> : <FooterText>
        <a href="/login">Login</a>
        {' | '}
        <a href="/signup">Register</a>
      </FooterText>}
    </FooterContainer>;
  }
}

export default Footer;
