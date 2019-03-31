import React, { Component } from 'react';
import SEOHeader from '../reusables/SEOHeader';
import DropdownMenu from '../reusables/DropdownMenu';
import PropTypes from 'prop-types';
import { TextHeader } from '../reusables/styled';

class MainMenu extends Component {
  static propTypes = {
    user: PropTypes.object,
    config: PropTypes.object,
    docTypes: PropTypes.array
  };

  render() {
    return <div>
      <SEOHeader title={this.props.config ? this.props.config.siteName :
        'My Website'}
      description={this.props.config ? this.props.config.description :
        'Welcome to my website!'}
      image={this.props.config ? this.props.config.image : ''}/>
      <div>
        <TextHeader>{this.props.config ? this.props.config.siteName :
          'My Website'}</TextHeader>
        {this.props.user ?
          <DropdownMenu menuNodes={this.props.user.roleId === 0 ?
            [{ url: '/admin/config', text: 'Site Settings' },
              { url: '/', text: 'View Front End' },
              { url: '/admin/register_type', text: 'Register Document Type' },
              { url: '', text: 'Edit Document Type...', childNodes:
                this.props.docTypes.map((docType) => {
                  return { url: `/admin/edit_type/${docType.docTypeId}`,
                    text: docType.docTypeName };
                })
              },
              { url: '', text: 'New...', childNodes:
                this.props.docTypes.map((docType) => {
                  return { url: `/admin/new/${docType.docTypeId}`,
                    text: docType.docTypeName };
                })
              },
              { url: '', text: 'Edit Existing...', childNodes:
                this.props.docTypes.map((docType) => {
                  return { url: `/admin/edit/${docType.docTypeId}`,
                    text: docType.docTypeName };
                })
              },
              { url: '', text: 'Edit Display Template For...',  childNodes:
                this.props.docTypes.map((docType) => {
                  return { url: `/admin/edit_template/${docType.docTypeId}`,
                    text: docType.docTypeName };
                })
              }] : [{ url: '', text: 'New...', childNodes:
                this.props.docTypes.map((docType) => {
                  return { url: `/admin/new/${docType.docTypeId}`,
                    text: docType.docTypeName };
                })
            },{ url: '', text: 'Edit Existing...', childNodes:
                this.props.docTypes.map((docType) => {
                  return { url: `/admin/edit/${docType.docTypeId}`,
                    text: docType.docTypeName };
                })
            }] } /> : null}
      </div>
    </div>;
  }
}

export default MainMenu;
