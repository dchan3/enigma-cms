import React from 'react';
import { object } from 'prop-types';
import styled from 'styled-components';

let FooterContainer =
  styled.div`text-align:center;font-family:sans-serif;margin:10px;`,
  FooterText = styled.p`margin:0;`;

function Footer({ user }) {
  return <FooterContainer>
    <FooterText>Powered by <a href="https://github.com/dchan3/enigma-cms">
      Enigma CMS</a>.</FooterText>
    {user ? <FooterText>
      Logged in as {user.username}.
      {' '}
      <a href='/admin'>Go to Admin Panel.</a>
      {' '}
      <a href='/admin/edit-profile'>Edit profile</a>.
      {' '}
      <a href='/api/users/logout'>Logout</a>.
      {' '}
      <a href='/admin/change-password'>Change password</a>.
    </FooterText> : <FooterText>
      <a href="/login">Login</a>
      {' | '}
      <a href="/signup">Register</a>
    </FooterText>}
  </FooterContainer>;
}

Footer.propTypes = {
  user: object
};

export default Footer;
