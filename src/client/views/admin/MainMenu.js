import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SEOHeader from '../../reusables/SEOHeader';
import DropdownMenu from '../../reusables/DropdownMenu';
import { TextHeader } from '../../reusables/styled';

class MainMenu extends Component {
  static propTypes = {
    staticContext: PropTypes.object
  }

  render() {
    var staticContext = this.props.staticContext || window.__INITIAL_DATA__;

    return <div>
      <SEOHeader title={staticContext.config ?
        staticContext.config.siteName :
        'My Website'}
      description={staticContext.config ?
        staticContext.config.description :
        'Welcome to my website!'}
      image={staticContext.config ?
        staticContext.config.image : ''}/>
      <div>
        <TextHeader>{staticContext.config ?
          staticContext.config.siteName :
          'My Website'}</TextHeader>
        {staticContext.user ?
          <DropdownMenu menuNodes={staticContext.user.roleId === 0 ?
            [{ url: '/admin/config', text: 'Site Settings' },
              { url: '/', text: 'View Front End' },
              { url: '/admin/register-type', text: 'Register Document Type' },
              { url: '', text: 'Edit Document Type...', childNodes:
                staticContext.types.map((docType) => {
                  return { url: `/admin/edit_type/${docType.docTypeId}`,
                    text: docType.docTypeName };
                })
              },
              { url: '', text: 'New...', childNodes:
                staticContext.types.map((docType) => {
                  return { url: `/admin/new/${docType.docTypeId}`,
                    text: docType.docTypeName };
                })
              },
              { url: '', text: 'Edit Existing...', childNodes:
                staticContext.types.map((docType) => {
                  return { url: `/admin/edit/${docType.docTypeId}`,
                    text: docType.docTypeName };
                })
              },
              { url: '', text: 'Edit Display Template For...',  childNodes:
                staticContext.types.map((docType) => {
                  return { url: `/admin/edit-template/${docType.docTypeId}`,
                    text: docType.docTypeName };
                })
              }] : [{ url: '', text: 'New...', childNodes:
                staticContext.types.map((docType) => {
                  return { url: `/admin/new/${docType.docTypeId}`,
                    text: docType.docTypeName };
                })
            },{ url: '', text: 'Edit Existing...', childNodes:
                staticContext.types.map((docType) => {
                  return { url: `/admin/edit/${docType.docTypeId}`,
                    text: docType.docTypeName };
                })
            }] } /> : null}
      </div>
    </div>;
  }
}

export default MainMenu;
