import React, { useEffect, useState } from 'react';
import TablePaginator from '../../reusables/TablePaginator';
import { TextHeader, SamePageAnchor } from '../../reusables';
import { default as asyncReqs } from '../../utils/api_request_async';

function UserMgmtLanding() {
  let [state, setState] = useState({
    users: []
  });

  useEffect(function() {
    asyncReqs.getRequest('users/get_all_users', (users) => {
      setState({ users })
    });
  }, []);

  let { users } = state;

  return [
    <TextHeader>Manage Users</TextHeader>,
    users.length ? <TablePaginator perPage={10} activeTabColor="cadetblue"
      items={users} truncate={true} columns={[
        {
          headerText: 'Picture',
          display: ({ pictureSrc }) => <div>
            <img style={{ maxWidth: '100px' }} src={pictureSrc} /></div>
        },
        {
          headerText: 'Username',
          display: ({ username }) => <p>
            <SamePageAnchor href={`/profile/${username}`}>{username}
            </SamePageAnchor></p>
        },
        {
          headerText: 'Email',
          display: ({ email }) => <p><a href={`mailto:${email}`}>{email}</a></p>
        },
        {
          headerText: 'Display name',
          display: ({ displayName }) => <p>{displayName}</p>
        }
      ]} /> : null
  ];
}

export default UserMgmtLanding;
