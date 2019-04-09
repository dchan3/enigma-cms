import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GeneratedForm from '../reusables/GeneratedForm';
import { default as urlUtils } from '../../lib/utils';

class ConfigPage extends Component {
  static propTypes = {
    staticContext: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.redirect = this.redirect.bind(this);
  }

  redirect() {
    window.location.href = '/admin';
  }

  render() {
    var staticContext = this.props.staticContext;

    return <GeneratedForm title="Site Settings" params={{
      siteName: {
        type: 'text',
        value: staticContext.config ? staticContext.config.siteName : ''
      },
      description: {
        type: 'text',
        label: 'Site Description',
        value: this.props.staticContext.config ?
          this.props.staticContext.config.description : ''
      },
      aboutBody: {
        type: 'text',
        value: this.props.staticContext.config ?
          this.props.staticContext.config.aboutBody : ''
      },
      stylesheet: {
        type: 'text',
        grammar: 'css',
        value: this.props.staticContext.config ?
          this.props.staticContext.config.stylesheet : ''
      },
      profileTemplate: {
        type: 'text',
        grammar: 'html',
        value: this.props.staticContext.config ?
          this.props.staticContext.config.profileTemplate : ''
      },
      menuLinks: {
        type: '[object]',
        shape: {
          linkText: {
            type: 'text'
          },
          linkUrl: {
            type: 'text'
          }
        },
        value: this.props.staticContext.config &&
          this.props.staticContext.config.menuLinks || [
          {
            linkText: '',
            linkUrl: ''
          }
        ]
      },
      useSlug: {
        type: 'enum',
        label: 'Use Slug',
        enumList: [{
          text: 'Yes', value: true }, {
          text: 'No', value: false
        }],
        value: this.props.staticContext.config !== undefined ?
          this.props.staticContext.config.useSlug : false
      },
      shortcodes: {
        type: '[object]',
        shape: {
          name: {
            type: 'text',
            label: 'Name'
          },
          args: {
            type: 'text',
            label: 'Args (comma-separated)'
          },
          code: {
            type: 'text',
            label: 'Body',
            grammar: 'js'
          }
        },
        value: this.props.staticContext.config &&
          this.props.staticContext.config.shortcodes || [{
          name: '',
          args: '',
          code: ''
        }]
      }
    }} method="post" successCallback={this.redirect}
    formAction={urlUtils.info.path('/api/site_config/update')} />
  }
}

export default ConfigPage;
