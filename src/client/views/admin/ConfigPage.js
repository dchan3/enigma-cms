import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GeneratedForm from '../../reusables/GeneratedForm';
import { default as urlUtils } from '../../../lib/utils';

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
    var staticContext = this.props.staticContext || window.__INITIAL_DATA__;

    return <GeneratedForm title="Site Settings" params={{
      siteName: {
        type: 'text',
        value: staticContext.config ? staticContext.config.siteName : ''
      },
      description: {
        type: 'text',
        label: 'Site Description',
        value: staticContext.config ?
          staticContext.config.description : ''
      },
      aboutBody: {
        type: 'text',
        value: staticContext.config ?
          staticContext.config.aboutBody : ''
      },
      stylesheet: {
        type: 'text',
        grammar: 'css',
        value: staticContext.config ?
          staticContext.config.stylesheet : ''
      },
      profileTemplate: {
        type: 'text',
        grammar: 'html',
        value: staticContext.config ?
          staticContext.config.profileTemplate : ''
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
        value: staticContext.config &&
          staticContext.config.menuLinks || [
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
        value: staticContext.config !== undefined ?
          staticContext.config.useSlug : false
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
        value: staticContext.config &&
          staticContext.config.shortcodes || [{
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
