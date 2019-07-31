import React from 'react';
import { array } from 'prop-types';
import SamePageAnchor from './SamePageAnchor';

function FrontMenu({ menuLinks }) {
  return <div className="front-menu__container">
    <ul className="front-menu__content">
      {menuLinks.map(({ linkUrl, linkText }) =>
        <li className="front-menu__link">
          <SamePageAnchor href={linkUrl}>{linkText}</SamePageAnchor></li>)}
    </ul>
  </div>;
}

FrontMenu.propTypes = {
  menuLinks: array
};

export default FrontMenu;
