import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FrontMenu extends Component {
  static propTypes = {
    config: PropTypes.object
  };

  render() {
    return this.props.config ? <div className="front-menu__container">
      <ul className="front-menu__content">
        {this.props.config.menuLinks.map((link) =>
          <li className="front-menu__link">
            <a href={link.linkUrl}>{link.linkText}</a></li>)}
      </ul>
    </div> : null;
  }
}

export default FrontMenu;
