import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

class SEOHeader extends Component {
  static defaultProps = {
    keywords: 'my website',
    image: null
  };

  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    keywords: PropTypes.string,
    image: PropTypes.string
  };

  render() {
    return (
      <Helmet>
        <title>{this.props.title}</title>
        <meta property="og:title" content={this.props.title} />
        <meta property='twitter:title' content={this.props.title} />

        <meta property="description" content={this.props.description} />
        <meta property="og:description" content={this.props.description} />
        <meta property='twitter:description' content={this.props.description} />

        <meta name='keywords' content={this.props.keywords || ''} />

        {this.props.image ? [
          <meta property='twitter:image' content={this.props.image || ''} />,
          <meta property='og:image' content={this.props.image || ''} />
        ] : null}
      </Helmet>
    );
  }
}

export default SEOHeader;
