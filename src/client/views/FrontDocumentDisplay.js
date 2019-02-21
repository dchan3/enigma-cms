import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Handlebars from 'handlebars';
import FrontMenu from '../reusables/FrontMenu';
import axios from 'axios';

class FrontDocumentDisplay extends Component {
  static propTypes = {
    match: PropTypes.object,
    config: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = {
      template: null,
      document: null
    };
  }

  componentDidMount() {
    axios.get((process.env.SERVER_URL || 'http://localhost:' +
    (process.env.SERVER_PORT || 8080)) + '/api/documents/get_document/' +
      this.props.match.params.docNode, { withCredentials: true })
      .then((res) => res.data)
      .then(data => {
        axios.get((process.env.SERVER_URL || 'http://localhost:' +
        (process.env.SERVER_PORT || 8080)) + '/api/documents/get_template/' +
          data.docTypeId, { withCredentials: true }).then((resp) => resp.data)
          .then(typeInfo => {
            this.setState({
              document: data, template: typeInfo, canDisplay: true });
          }).catch((err) => {
            console.log(err);
            console.log('Could not get document.');
          });
      })
      .catch((err) => {
        console.log(err);
        console.log('Could not get document.');
      });
  }

  render() {
    if (this.state.template !== null && this.state.document !== null)
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
    else return null;
  }
}

export default FrontDocumentDisplay;
