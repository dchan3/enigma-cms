import React from 'react';
import { oneOfType, string, func, object, array } from 'prop-types';
import styled from 'styled-components';

function SamePageAnchor({
  children, href, target, className, id, style, history, component
}) {
  let Anchor = component || styled.a``;

  function handleClick(event) {
    if (href.startsWith('/')) {
      event.preventDefault();
      history.push(href);
    }
  }

  return <Anchor {...{ href, target, className, id, style
  }} onClick={handleClick}>{children}</Anchor>;
}

export default SamePageAnchor;

SamePageAnchor.propTypes = {
  href: oneOfType([string, func]),
  target: oneOfType([string, func]),
  className: oneOfType([string, func]),
  id: oneOfType([string, func]),
  style: oneOfType([object, func]),
  children: oneOfType([array, func]),
  history: object
};
