import { h } from 'preact'; /** @jsx h **/
import { DropdownMenu } from '../../reusables/back_exports';
import useStaticContext from '../../hooks/useStaticContext.js';

export default function MainMenu() {
  let { user, types } = useStaticContext(['user', 'types']);

  let isAdmin = user && user.roleId === 0 || false, menuNodes = [];
  if (isAdmin) menuNodes.push({ url: '/admin/edit-config',
    text: 'Site Settings' }, { url: '/admin/edit-theme',
    text: 'Theme Settings' }, { url: '/admin/register-type',
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
  }, {
    url: '/admin/user-mgmt', text: 'Manage Users'
  });

  return user ? <DropdownMenu {...{ menuNodes }} /> : null;
}
