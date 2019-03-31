import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GeneratedForm from '../reusables/GeneratedForm';
import axios from 'axios';
import { default as urlUtils } from '../utils';

class EditDisplayTemplate extends Component {
  static propTypes = {
    match: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      docType: null,
      template: null
    }
  }

  redirect() {
    window.location.href = '/admin';
  }

  componentDidMount() {
    axios.get(urlUtils.serverInfo.path(
      `/api/documents/get_type/${this.props.match.params.docTypeId}`),
    { withCredentials: true })
      .then((res) => res.data)
      .then(data => { this.setState({ docType: data }); })
      .catch((err) => {
        console.log(err);
        console.log('Could not get document type.');
      });

    axios.get(urlUtils.serverInfo.path(
      `/api/documents/get_template/${this.props.match.params.docTypeId}`),
    { withCredentials: true })
      .then((res) => res.data)
      .then(data => { this.setState({ template: data }); })
      .catch((err) => {
        console.log(err);
        console.log('Could not get template data.');
      });
  }

  render() {
    if (this.state.docType !== null && this.state.template !== null)
      return <GeneratedForm title=
        {`Edit ${this.state.docType.docTypeName} Display Template`} params={{
        templateBody: {
          type: 'text',
          label: 'Template Body',
          grammar: 'html',
          value: this.state.template !== null ?
            this.state.template.templateBody : ''
        }
      }} method="post" successCallback={this.redirect}
      formAction={urlUtils.serverInfo.path(
        `/api/documents/update_template/${this.props.match.params.docTypeId}`)}
      />;
    else return null;
  }
}

export default EditDisplayTemplate;
