import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FrontMenu from '../../reusables/FrontMenu';

class FrontHeader extends Component {
  static propTypes = {
    staticContext: PropTypes.object
  };

  render() {
    let { config } = this.props.staticContext;

    return <div>
      <h1 className="front-header">
        {config ? config.siteName : 'My Website'}</h1>
      <FrontMenu config={config} />
    </div>;
  }
}

export default FrontHeader;