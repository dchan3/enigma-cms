import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GeneratedForm from '../reusables/GeneratedForm';
import axios from 'axios';
import { default as urlUtils } from '../../lib/utils';

class DocumentEditPage extends Component {
  static propTypes = {
    match: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      docType: null,
      canDisplay: false
    }
  }

  componentDidMount() {
    axios.get(urlUtils.info.path(
      `/api/documents/get_type/${this.props.match.params.docTypeId}`),
    { withCredentials: true })
      .then((res) => res.data)
      .then(data => { this.setState({ docType: data, canDisplay: true }); })
      .catch((err) => {
        console.log(err);
        console.log('Could not get document type.');
        this.setState({ docType: null, canDisplay: true });
      });
  }

  redirect() {
    window.location.href = `/admin/edit/${this.props.match.params.docTypeId}`;
  }

  render() {
    let params = {};

    if (this.state.docType !== null) {
      this.state.docType.attributes.forEach(attr => {
        params[attr.attrName] = {
          label: attr.attrName,
          type: attr.attrType,
        };

        if (attr.grammar) {
          params[attr.attrName].grammar = attr.grammar;
        }

        if (attr.maximum) {
          params[attr.attrName].maximum = attr.maximum;
        }

        if (attr.minimum) {
          params[attr.attrName].minimum = attr.minimum;
        }
      });
    }

    if (this.state.canDisplay)
      return <GeneratedForm title={`New ${this.state.docType.docTypeName}`}
        params={params} method="post"
        formAction={urlUtils.info.path(
          `/api/documents/new_document/${this.props.match.params.docTypeId}`)}
        successCallback={this.redirect}
      />;
    else return null;
  }
}

export default DocumentEditPage;
