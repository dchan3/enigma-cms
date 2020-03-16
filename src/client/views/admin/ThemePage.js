import { h } from 'preact' /** @jsx h **/
import { GeneratedForm } from '../../reusables/back_exports';
import useStaticContext from '../../hooks/useStaticContext';

export default function ThemePage() {
  let { theme } = useStaticContext(['theme']);

  return <GeneratedForm title="Site Settings" currentValue={theme ||
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
  }} redirectUrl='/admin' formAction='site_theme/update' />;
}
