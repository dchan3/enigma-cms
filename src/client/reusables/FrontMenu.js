import React from 'react';
import { object } from 'prop-types';

function FrontMenu({ config }) {
  return config ? <div className="front-menu__container">
    <ul className="front-menu__content">
      {config.menuLinks.map(({ linkUrl, linkText }) =>
        <li className="front-menu__link">
          <a href={linkUrl}>{linkText}</a></li>)}
    </ul>
  </div> : null;
}

FrontMenu.propTypes = {
  config: object
}

export default FrontMenu;
