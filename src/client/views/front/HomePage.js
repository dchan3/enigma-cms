import React, { Component } from 'react';
import { object } from 'prop-types';

class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    staticContext: object
  };

  render() {
    return <div />;
  }
}

export default HomePage;
