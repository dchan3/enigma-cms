import React, { Component } from 'react';
import PropTypes from 'prop-types';

class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    staticContext: PropTypes.object
  };

  render() {
    return <div />;
  }
}

export default HomePage;
