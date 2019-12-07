import React from 'react';
import SamePageAnchor from './SamePageAnchor';
import fromCss from '../utils/component_from_css';
import useStaticContext from '../hooks/useStaticContext';

let FooterContainer = fromCss('div',
    'text-align:center;font-family:sans-serif;margin:10px;'), FooterText =
  fromCss('p', 'margin:0px;');

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
