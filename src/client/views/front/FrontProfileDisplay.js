import React from 'react';
import { object } from 'prop-types';
import Handlebars from 'handlebars';
import { Redirect } from 'react-router-dom';
import { Metamorph } from 'react-metamorph';

function FrontProfileDisplay({ staticContext:
  { profileUser, config: { profileTemplate, siteName } } }) {
  if (profileUser) {
    let { username, displayName, pictureSrc } = profileUser, template =
    Handlebars.compile(profileTemplate),
      pref = `${displayName || username}'s Profile`, disp =
      `${pref} | ${siteName}`, desc = `${pref}.`
    return [<Metamorph title={disp} description={desc} image={pictureSrc}/>,
      <div dangerouslySetInnerHTML={{ __html: template(profileUser) }} />
    ];
  }
  else return <Redirect to='/not-found' />;
}

FrontProfileDisplay.propTypes = { match: object, staticContext: object };

export default FrontProfileDisplay;
