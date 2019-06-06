import React from 'react';
import { object } from 'prop-types';
import { FrontMenu } from '../../reusables';

function FrontHeader({ staticContext }) {
  let { config } = staticContext;

  return <div>
    <h1 className="front-header">
      {config ? config.siteName : 'My Website'}</h1>
    <FrontMenu config={config} />
  </div>;
}

FrontHeader.propTypes = {
  staticContext: object
};

export default FrontHeader;
