import { h } from 'preact'; /** @jsx h **/
import { useEffect, useState } from 'preact/hooks';
import { TextHeader, SamePageAnchor, TablePaginator, ProfileImage, HoverButton, GeneratedForm } from
  '../../reusables/back_exports';
import { getRequest } from '../../utils/api_request_async';
import useStaticContext from '../../hooks/useStaticContext';

function ChangeableProfilePicture({ pictureSrc, username, userId }) {
  let [changing, setChanging] = useState(false);

  return <div style={{ position: 'relative' }}>
    <ProfileImage src={pictureSrc} role='presentation' title={`${username}'s profile picture`} />
    {changing ? <div><GeneratedForm title='Upload Profile Picture' currentValue={{
      userId, profilePhoto: '', fileContent: ''
    }}
    params={{
      userId: { label: 'User ID', type: 'text', hidden: true },
      profilePhoto: { type: 'file' },
      fileContent: { type: 'string', hidden: true },
    }} redirectUrl='' formAction='users/update_profile_picture' />
    <p onClick={() => setChanging(false)}>Cancel</p>
   </div>: <HoverButton onClick={() => setChanging(true)}>Change</HoverButton>}
  </div>;
}

export default function UserMgmtLanding() {
  let [state, setState] = useState({
    users: []
  });

  useEffect(function() {
    getRequest('users/get_all_users', (users) => {
      setState({ users });
    });
  }, []);

  let { users } = state, { config: { themeColor }, user } = useStaticContext();

  return [
    <TextHeader>Manage Users</TextHeader>,
    users.length ? <TablePaginator perPage={10} activeTabColor={themeColor}
      items={users} truncate={true} columns={[
        {
          headerText: 'Picture',
          display: ({ pictureSrc, username, userId }) => userId === user.userId ? 
            <ChangeableProfilePicture pictureSrc={pictureSrc} username={username} userId={userId} /> :
            <ProfileImage pictureSrc={pictureSrc} />
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
