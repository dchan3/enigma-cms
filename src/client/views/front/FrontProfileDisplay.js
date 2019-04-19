import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Handlebars from 'handlebars';
import FrontMenu from '../../reusables/FrontMenu';
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
    if (this.props.staticContext.profileUser !== null) {
      let template =
        Handlebars.compile(this.props.staticContext.config.profileTemplate);
      return <div>
        <div>
          <h1 className="front-header">
            {this.props.staticContext.config ?
              this.props.staticContext.config.siteName :
              'My Website'}</h1>
        </div>
        <FrontMenu config={this.props.staticContext.config} />
        <div dangerouslySetInnerHTML={{ __html:
          template(this.props.staticContext.profileUser) }} />
      </div>;
    }
    else if (!this.props.staticContext.profileUser)
      return <Redirect to='/not-found' />;
    else return null;
  }
}

export default FrontProfileDisplay;
