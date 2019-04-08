import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GeneratedForm from '../reusables/GeneratedForm';
import { default as urlUtils } from '../../lib/utils';

class ConfigPage extends Component {
  static propTypes = {
    config: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.redirect = this.redirect.bind(this);
  }

  redirect() {
    window.location.href = '/admin';
  }

  render() {
    return <GeneratedForm title="Site Settings" params={{
      siteName: {
        type: 'text',
        value: this.props.config ? this.props.config.siteName : ''
      },
      description: {
        type: 'text',
        label: 'Site Description',
        value: this.props.config ? this.props.config.description : ''
      },
      aboutBody: {
        type: 'text',
        value: this.props.config ? this.props.config.aboutBody : ''
      },
      stylesheet: {
        type: 'text',
        grammar: 'css',
        value: this.props.config ? this.props.config.stylesheet : ''
      },
      profileTemplate: {
        type: 'text',
        grammar: 'html',
        value: this.props.config ? this.props.config.profileTemplate : ''
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
        value: this.props.config && this.props.config.menuLinks || [
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
        value: this.props.config !== undefined ?
          this.props.config.useSlug : false
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
        value: this.props.config && this.props.config.shortcodes || [{
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
