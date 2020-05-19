import { h } from 'preact'; /** @jsx h **/
import { FrontMenu } from '../../reusables/front_exports';
import useStaticContext from '../../hooks/useStaticContext';

export default function FrontHeader() {
  let { config: { siteName, menuLinks } } = useStaticContext(['config']);

  return [
    <h1 className="front-header">{siteName}</h1>,
    <FrontMenu {...{ menuLinks }} />
  ];
}
