import React from 'react';
import { object } from 'prop-types';
import { FrontMenu } from '../../reusables';

function FrontHeader({ staticContext: { config: { siteName, menuLinks } },
  history }) {
  return <div>
    <h1 className="front-header">{siteName || 'My Website'}</h1>
    <FrontMenu {...{ history, menuLinks }} />
  </div>;
}

FrontHeader.propTypes = {
  staticContext: object
};

export default FrontHeader;
