import { h } from 'preact'; /** @jsx h **/
import SamePageAnchor from './SamePageAnchor';

export default function FrontMenu({ menuLinks }) {
  return <ul className="front-menu__content">
    {menuLinks.map(({ linkUrl, linkText }) =>
      <li className="front-menu__link">
        <SamePageAnchor href={linkUrl}>{linkText}</SamePageAnchor></li>)}
  </ul>;
}
