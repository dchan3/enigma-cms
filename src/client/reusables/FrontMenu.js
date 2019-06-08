import React from 'react';
import { object } from 'prop-types';

function FrontMenu({ menuLinks }) {
  return <div className="front-menu__container">
    <ul className="front-menu__content">
      {menuLinks.map(({ linkUrl, linkText }) =>
        <li className="front-menu__link">
          <a href={linkUrl}>{linkText}</a></li>)}
    </ul>
  </div>;
}

FrontMenu.propTypes = {
  menuLinks: object
}

export default FrontMenu;
