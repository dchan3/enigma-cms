import React, { useContext } from 'react';
import { FrontMenu } from '../../reusables';
import StaticContext from '../../contexts/StaticContext';

function FrontHeader() {
  let { staticContext: { config: { siteName, menuLinks } } } =
    useContext(StaticContext);

  return <div>
    <h1 className="front-header">{siteName || 'My Website'}</h1>
    <FrontMenu {...{ menuLinks }} />
  </div>;
}

export default FrontHeader;
