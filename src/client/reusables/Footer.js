import React from 'react';
import styled from 'styled-components';
import SamePageAnchor from './SamePageAnchor';
let FooterContainer = styled.div`
text-align:center;font-family:sans-serif;margin:10px;`, FooterText =
  styled.p`margin:0;`;
import useStaticContext from '../hooks/useStaticContext';

function Footer() {
  let { user } = useStaticContext(['user']);

  return <FooterContainer>
    <FooterText>Powered by <a href="https://github.com/dchan3/enigma-cms">
      Enigma CMS</a>.</FooterText>
    {user ? <FooterText>
      Logged in as {user.username}.
      {' '}
      <SamePageAnchor href='/admin'>Go to Admin Panel.</SamePageAnchor>
      {' '}
      <SamePageAnchor href='/admin/edit-profile'>Edit profile</SamePageAnchor>.
      {' '}
      <SamePageAnchor href='/api/users/logout'>Logout</SamePageAnchor>.
      {' '}
      <SamePageAnchor href='/admin/change-password'>Change password
      </SamePageAnchor>.
    </FooterText> : <FooterText>
      <SamePageAnchor href="/login">Login</SamePageAnchor>
      {' | '}
      <SamePageAnchor href="/signup">Register</SamePageAnchor>
    </FooterText>}
  </FooterContainer>;
}

export default Footer;
