import React from 'react';
import { GeneratedForm, AdminFrame } from '../../reusables';
import useStaticContext from '../../hooks/useStaticContext';

function ThemePage() {
  let { theme } = useStaticContext(['theme']);

  return <AdminFrame><GeneratedForm title="Site Settings" currentValue={theme ||
  {
    header: '',
    menuBar: '',
    menuLink: '',
    overall: ''
  }}
  params={{
    header: { type: 'text', grammar: 'css' },
    menuBar: { type: 'text', grammar: 'css' },
    menuLink: { type: 'text', grammar: 'css' },
    overall: { type: 'text', grammar: 'css' },
  }} redirectUrl='/admin' formAction='site_theme/update' /></AdminFrame>
}

export default ThemePage;
