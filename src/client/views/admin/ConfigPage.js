import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GeneratedForm from '../../reusables/GeneratedForm';

class ConfigPage extends Component {
  static propTypes = {
    staticContext: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {
    let { config } = this.props.staticContext;

    return <GeneratedForm title="Site Settings" params={{
      siteName: {
        type: 'text',
        value: config ? config.siteName : ''
      },
      iconFile: {
        type: 'file'
      },
      fileContent: {
        type: 'string',
        hidden: 'true'
      },
      description: {
        type: 'text',
        label: 'Site Description',
        value: config ? config.description : ''
      },
      aboutBody: {
        type: 'text',
        value: config ? config.aboutBody : ''
      },
      stylesheet: {
        type: 'text',
        grammar: 'css',
        value: config ? config.stylesheet : ''
      },
      profileTemplate: {
        type: 'text',
        grammar: 'html',
        value: config ? config.profileTemplate : ''
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
        value: config ? config.menuLinks : [
          {
            linkText: '',
            linkUrl: ''
          }
        ]
      },
      useSlug: {
        type: 'enum',
        enumList: [{
          text: 'Yes', value: true }, {
          text: 'No', value: false
        }],
        value: config ? config.useSlug : false
      },
      shortcodes: {
        type: '[object]',
        shape: {
          name: {
            type: 'text'
          },
          args: {
            type: '[text]',
            label: 'Arguments'
          },
          code: {
            type: 'text',
            label: 'Body',
            grammar: 'js'
          }
        },
        value: (config && config.shortcodes && config.shortcodes.length > 0) ?
          config.shortcodes : [{
            name: '',
            args: [''],
            code: ''
          }]
      },
      keywords: {
        type: '[text]',
        value: (config && config.keywords && config.keywords.length > 0) ?
          config.keywords : ['']
      }
    }}
    method="post" redirectUrl='/admin' formAction='/api/site_config/update' />
  }
}

export default ConfigPage;
