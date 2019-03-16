import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GeneratedForm from '../reusables/GeneratedForm';
import axios from 'axios';
import { default as urlUtils } from '../utils';

class DocumentEditPage extends Component {
  static propTypes = {
    match: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      docType: null,
      canDisplay: false
    }
  }

  componentDidMount() {
    console.log(urlUtils.serverInfo.path('/api/documents/get_type/') +
      this.props.match.params.docTypeId);
    axios.get(urlUtils.serverInfo.path('/api/documents/get_type/' +
      this.props.match.params.docTypeId), { withCredentials: true })
      .then((res) => res.data)
      .then(data => { this.setState({ docType: data, canDisplay: true }); })
      .catch((err) => {
        console.log(err);
        console.log('Could not get document type.');
        this.setState({ docType: null, canDisplay: true });
      });
  }

  render() {
    var params = {};

    if (this.state.docType !== null) {
      this.state.docType.attributes.forEach(attr => {
        params[attr.attrName] = {
          label: attr.attrName,
          type: attr.attrType,
        }

        if (attr.grammar) {
          params[attr.attrName].grammar = attr.grammar;
        }
      });
    }

    if (this.state.canDisplay)
      return <GeneratedForm title={'New ' + this.state.docType.docTypeName}
        params={params} method="post"
        formAction={urlUtils.serverInfo.path('/api/documents/new_document/') +
          this.props.match.params.docTypeId}
      />;
    else return null;
  }
}

export default DocumentEditPage;
