import React from 'react';
import { AdminFrame } from '../../reusables';
import useStaticContext from '../../hooks/useStaticContext';

export default function AdminLanding() {
  let { user: { username } } = useStaticContext(['user']);

  return <AdminFrame>
    <h1>Welcome, {username}.</h1>
  </AdminFrame>;
}
