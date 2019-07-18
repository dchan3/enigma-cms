import React, { useEffect, useState } from 'react';
import { get as axget } from 'axios';
import { object } from 'prop-types';
import styled from 'styled-components';
import SamePageAnchor from './SamePageAnchor';
let FooterContainer = styled.div`
text-align:center;font-family:sans-serif;margin:10px;`, FooterText =
  styled.p`margin:0;`;

function Footer({ staticContext, history }) {
  let [state, setState] = useState({
    user: staticContext && staticContext.user || null
  });

  useEffect(function() {
    if (!state.user) axget('/api/users/get').then(({ data: user }) => {
      setState({ user })
    });
  }, []);

  var { user } = state;

  return <FooterContainer>
    <FooterText>Powered by <a href="https://github.com/dchan3/enigma-cms">
      Enigma CMS</a>.</FooterText>
    {user ? <FooterText>
      Logged in as {user.username}.
      {' '}
      <SamePageAnchor {...{ history }} href='/admin'>Go to Admin Panel.
      </SamePageAnchor>
      {' '}
      <SamePageAnchor {...{ history }} href='/admin/edit-profile'>Edit profile
      </SamePageAnchor>.
      {' '}
      <SamePageAnchor {...{ history }}  href='/api/users/logout'>Logout
      </SamePageAnchor>.
      {' '}
      <SamePageAnchor {...{ history }} href='/admin/change-password'>
        Change password</SamePageAnchor>.
    </FooterText> : <FooterText>
      <SamePageAnchor {...{ history }} href="/login">Login</SamePageAnchor>
      {' | '}
      <SamePageAnchor {...{ history }} href="/signup">Register</SamePageAnchor>
    </FooterText>}
  </FooterContainer>;
}

Footer.propTypes = {
  staticContext: object,
  history: object
};

export default Footer;
