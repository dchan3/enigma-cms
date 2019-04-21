import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SEOHeader from '../../reusables/SEOHeader';

class HomePage extends Component {
  static propTypes = {
    staticContext: PropTypes.object
  };

  render() {
    return <div>
      <style>
        {this.props.staticContext.config ?
          this.props.staticContext.config.stylesheet : ''}
      </style>
      <SEOHeader title={this.props.staticContext.config ?
        this.props.staticContext.config.siteName :
        'My Website'} description={this.props.staticContext.config ?
        this.props.staticContext.config.description :
        'Welcome to my website!'}
      image={this.props.staticContext.config ?
        this.props.staticContext.config.image : ''}/>
    </div>;
  }
}

export default HomePage;
