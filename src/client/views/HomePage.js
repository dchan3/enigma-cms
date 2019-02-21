import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SEOHeader from '../reusables/SEOHeader';
import FrontMenu from '../reusables/FrontMenu';

class HomePage extends Component {
  static propTypes = {
    user: PropTypes.object,
    config: PropTypes.object
  }

  render() {
    return <div>
      <style>
        {this.props.config ? this.props.config.stylesheet : ''}
      </style>
      <SEOHeader title={this.props.config ? this.props.config.siteName :
        'My Website'}
      description={this.props.config ? this.props.config.description :
        'Welcome to my website!'}
      image={this.props.config ? this.props.config.image : ''}/>
      <div>
        <h1 className="front-header">
          {this.props.config ? this.props.config.siteName :
            'My Website'}</h1>
      </div>
      <FrontMenu config={this.props.config} />
    </div>;
  }
}

export default HomePage;
