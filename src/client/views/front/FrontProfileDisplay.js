import React from 'react';
import PropTypes from 'prop-types';
import Handlebars from 'handlebars';
import { Redirect } from 'react-router-dom';
import { Metamorph } from 'react-metamorph';

function FrontProfileDisplay({ staticContext }) {
  let { profileUser, config } = staticContext;

  if (profileUser) {
    let template =
      Handlebars.compile(config.profileTemplate), disp =
        `${profileUser.displayName ||
          profileUser.username}'s Profile | ${config.siteName}`, desc =
        `${profileUser.displayName || profileUser.username}'s Profile.`
    return [<Metamorph title={disp} description={desc}
      image={profileUser.pictureSrc}/>,
    <div dangerouslySetInnerHTML={{ __html: template(profileUser) }} />
    ];
  }
  else return <Redirect to='/not-found' />;
}

FrontProfileDisplay.propTypes = {
  match: PropTypes.object,
  staticContext: PropTypes.object
};

export default FrontProfileDisplay;
