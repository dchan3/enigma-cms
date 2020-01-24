import { h } from 'preact'; /** @jsx h **/
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

export default FrontMenu;
