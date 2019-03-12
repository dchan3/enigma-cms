import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Handlebars from 'handlebars';
import FrontMenu from '../reusables/FrontMenu';
import { Redirect } from 'react-router';
import axios from 'axios';
import { default as urlUtils } from '../utils';

class FrontDocumentDisplay extends Component {
  static propTypes = {
    match: PropTypes.object,
    config: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = {
      template: null,
      document: null,
      ready: false
    };
  }

  componentDidMount() {
    axios.get(urlUtils.serverInfo.path(
      (this.props.config.useSlug ?
        '/api/documents/get_document_by_slug/' :
        '/api/documents/get_document/') +
      this.props.match.params.docNode), { withCredentials: true })
      .then((res) => res.data)
      .then(data => {
        axios.get(urlUtils.serverInfo.path('/api/documents/get_template/' +
          data.docTypeId), { withCredentials: true }).then((resp) => resp.data)
          .then(typeInfo => {
            this.setState({
              document: data, template: typeInfo, ready: true });
          }).catch((err) => {
            console.log(err);
            console.log('Could not get document.');
            this.setState({
              ready: true
            });
          });
      })
      .catch((err) => {
        console.log(err);
        console.log('Could not get document.');
        this.setState({
          ready: true
        });
      });
  }

  render() {
    if (this.state.template !== null && this.state.document !== null) {
      return <div>
        <div>
          <h1 className="front-header">
            {this.props.config ? this.props.config.siteName :
              'My Website'}</h1>
        </div>
        <FrontMenu config={this.props.config} />
        <div dangerouslySetInnerHTML=
          {{ __html:  Handlebars.compile(
            this.state.template.templateBody)(this.state.document.content) }}>
        </div>
      </div>;
    }
    else if (this.state.ready && !this.state.document)
      return <Redirect to='/not_found' />
    else return null;
  }
}

export default FrontDocumentDisplay;
