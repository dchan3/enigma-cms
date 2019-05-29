import React, { Component } from 'react';
import { object } from 'prop-types';

class FrontMenu extends Component {
  static propTypes = {
    config: object
  };

  render() {
    return this.props.config ? <div className="front-menu__container">
      <ul className="front-menu__content">
        {this.props.config.menuLinks.map(({ linkUrl, linkText }) =>
          <li className="front-menu__link">
            <a href={linkUrl}>{linkText}</a></li>)}
      </ul>
    </div> : null;
  }
}

export default FrontMenu;
