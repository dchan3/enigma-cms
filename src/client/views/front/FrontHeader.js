import React from 'react';
import { FrontMenu } from '../../reusables';
import useStaticContext from '../../hooks/useStaticContext.js';

function FrontHeader() {
  let { config: { siteName, menuLinks } } = useStaticContext(['config']);

  return <div>
    <h1 className="front-header">{siteName || 'My Website'}</h1>
    <FrontMenu {...{ menuLinks }} />
  </div>;
}

export default FrontHeader;
