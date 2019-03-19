import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Handlebars from 'handlebars';
import FrontMenu from '../reusables/FrontMenu';
import { Redirect } from 'react-router';
import axios from 'axios';
import { default as urlUtils } from '../utils';

class FrontProfileDisplay extends Component {
  static propTypes = {
    match: PropTypes.object,
    config: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = {
      template: this.props.config.profileTemplate,
      user: null,
      ready: false
    };
  }

  componentDidMount() {
    axios.get(urlUtils.serverInfo.path('/api/users/get_user_by_username/' +
      this.props.match.params.username), { withCredentials: true })
      .then((res) => res.data)
      .then(data => {
        this.setState({ user: data, ready: true });
      }).catch(() => {
        this.setState({ ready: true });
      });
  }

  render() {
    if (this.state.user !== null) {
      console.log(this.state.user);
      var template = Handlebars.compile(this.props.config.profileTemplate);
      return <div>
        <div>
          <h1 className="front-header">
            {this.props.config ? this.props.config.siteName :
              'My Website'}</h1>
        </div>
        <FrontMenu config={this.props.config} />
        <div dangerouslySetInnerHTML={{ __html: template(this.state.user) }} />
      </div>;
    }
    else if (this.state.ready && !this.state.user)
      return <Redirect to='/not_found' />
    else return null;
  }
}

export default FrontProfileDisplay;
