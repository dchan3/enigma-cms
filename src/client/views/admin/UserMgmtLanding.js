import { h } from 'preact'; /** @jsx h **/
import { useEffect, useState } from 'preact/hooks';
import { TextHeader, SamePageAnchor, TablePaginator, ProfileImage } from
  '../../reusables/back_exports';
import { getRequest } from '../../utils/api_request_async';
import useStaticContext from '../../hooks/useStaticContext';

export default function UserMgmtLanding() {
  let [state, setState] = useState({
    users: []
  });

  useEffect(function() {
    getRequest('users/get_all_users', (users) => {
      setState({ users });
    });
  }, []);

  let { users } = state, { config: { themeColor } } = useStaticContext();

  return [
    <TextHeader>Manage Users</TextHeader>,
    users.length ? <TablePaginator perPage={10} activeTabColor={themeColor}
      items={users} truncate={true} columns={[
        {
          headerText: 'Picture',
          display: ({ pictureSrc }) => <div><ProfileImage src={pictureSrc} /></div>
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
      ]} /> : null];
}
