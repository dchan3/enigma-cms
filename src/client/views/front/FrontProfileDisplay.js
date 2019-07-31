import React, { useState, useEffect, useContext } from 'react';
import { get as axget } from 'axios';
import Handlebars from 'handlebars';
import { Metamorph } from 'react-metamorph';
import GeneralContext from '../../contexts/GeneralContext';

function FrontProfileDisplay()
{
  let { generalState } = useContext(GeneralContext), { staticContext, match: {
      params: { username: urlUsername }
    } } =
    generalState, [state, setState] = useState({
      profileUser: staticContext.profileUser &&
      staticContext.profileUser.username === urlUsername &&
      staticContext.profileUser || null
    });

  useEffect(function() {
    let { profileUser } = staticContext;
    if (!profileUser) {
      axget(
        `/api/documents/get_user_by_username/${urlUsername}`)
        .then(
          ({ data }) => {
            setState({ profileUser: data })
          })
    }
  }, []);

  let { profileUser } = state, { profileTemplate, siteName } =
    staticContext.config;

  if (profileUser) {
    let { username, displayName, pictureSrc } = profileUser, template =
    Handlebars.compile(profileTemplate),
      pref = `${displayName || username}'s Profile`, disp =
      `${pref} | ${siteName}`, desc = `${pref}.`
    return [<Metamorph title={disp} description={desc} image={pictureSrc}/>,
      <div dangerouslySetInnerHTML={{ __html: template(profileUser) }} />];
  }
  else return null;
}

export default FrontProfileDisplay;
