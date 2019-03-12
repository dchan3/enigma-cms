import React, { Component } from 'react';
import SEOHeader from '../reusables/SEOHeader';
import DropdownMenu from '../reusables/DropdownMenu';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { default as urlUtils } from '../utils';

var TextHeader = styled.h1`
  text-align: center;
  text-transform: uppercase;
  font-family: sans-serif;
`;

class MainPage extends Component {
  static propTypes = {
    user: PropTypes.object,
    config: PropTypes.object,
    docTypes: PropTypes.array
  }

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
                  return { url: '/admin/edit_type/' + docType.docTypeId,
                    text: docType.docTypeName };
                })
              },
              { url: '', text: 'New...', childNodes:
                this.props.docTypes.map((docType) => {
                  return { url: '/admin/new/' + docType.docTypeId,
                    text: docType.docTypeName };
                })
              },
              { url: '', text: 'Edit Existing...', childNodes:
                this.props.docTypes.map((docType) => {
                  return { url: '/admin/edit/' + docType.docTypeId,
                    text: docType.docTypeName };
                })
              },
              { url: '', text: 'Edit Display Template For...',  childNodes:
                this.props.docTypes.map((docType) => {
                  return { url: '/admin/edit_template/' + docType.docTypeId,
                    text: docType.docTypeName };
                })
              },
              { url: urlUtils.serverInfo.path('/api/users/logout'),
                text: 'Logout' }] : [
              { url: urlUtils.serverInfo.path('/api/users/logout'),
                text: 'Logout' }] } /> : null}
      </div>
    </div>;
  }
}

export default MainPage;
