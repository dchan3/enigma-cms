import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Handlebars from 'handlebars';
import { Redirect } from 'react-router';

class FrontProfileDisplay extends Component {
  static propTypes = {
    match: PropTypes.object,
    staticContext: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {
    let { profileUser, config } = this.props.staticContext;

    if (profileUser !== null) {
      let template =
        Handlebars.compile(config.profileTemplate);
      return <div dangerouslySetInnerHTML={{ __html:
          template(profileUser) }} />;
    }
    else if (!profileUser)
      return <Redirect to='/not-found' />;
    else return null;
  }
}

export default FrontProfileDisplay;
