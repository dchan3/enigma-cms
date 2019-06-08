import React from 'react';
import { object } from 'prop-types';
import { DropdownMenu } from '../../reusables';

function MainMenu({ staticContext: { user, types } }) {
  let isAdmin = user && user.roleId === 0 || false,
    menuNodes = [];
  if (isAdmin) menuNodes.push({ url: '/admin/edit-config',
    text: 'Site Settings' }, { url: '/admin/register-type',
    text: 'Register Document Type' }, {
    url: '', text: 'Edit Document Type...', childNodes:
      types.map(({ docTypeId, docTypeName }) => {
        return { url: `/admin/edit-type/${docTypeId}`, text: docTypeName };
      })
  });

  menuNodes.push({ url: '', text: 'New...', childNodes:
    types.map(({ docTypeId, docTypeName }) => {
      return { url: `/admin/new/${docTypeId}`, text: docTypeName };
    })
  },
  { url: '', text: 'Edit Existing...', childNodes:
    types.map(({ docTypeId, docTypeName }) => {
      return { url: `/admin/edit/${docTypeId}`, text: docTypeName };
    })
  },
  { url: '', text: 'Edit Display Template For...', childNodes:
    types.map(({ docTypeId, docTypeName }) => {
      return { url: `/admin/edit-template/${docTypeId}`, text: docTypeName };
    })
  }, {
    url: '/admin/file-mgmt', text: 'Manage Files'
  }, {
    url: '/admin/upload-file', text: 'Upload File'
  });

  return <div>
    {user ? <DropdownMenu menuNodes={menuNodes} /> : null}
  </div>;
}

MainMenu.propTypes = {
  staticContext: object
};

export default MainMenu;
