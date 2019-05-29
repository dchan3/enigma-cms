import React, { Component } from 'react';
import { object } from 'prop-types';
import { FrontMenu } from '../../reusables';

class FrontHeader extends Component {
  static propTypes = {
    staticContext: object
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
