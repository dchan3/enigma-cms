import React, { useContext } from 'react';
import { object } from 'prop-types';
import { FrontMenu } from '../../reusables';
import GeneralContext from '../../contexts/GeneralContext';

function FrontHeader() {
  let { generalState } = useContext(GeneralContext);

  let { staticContext: { config: { siteName, menuLinks } } } = 
    generalState;

  return <div>
    <h1 className="front-header">{siteName || 'My Website'}</h1>
    <FrontMenu {...{ menuLinks }} />
  </div>;
}

FrontHeader.propTypes = {
  staticContext: object
};

export default FrontHeader;
