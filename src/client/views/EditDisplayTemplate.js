import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GeneratedForm from '../reusables/GeneratedForm';
import axios from 'axios';

class EditDisplayTemplate extends Component {
  static propTypes = {
    match: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      docType: null,
      template: null
    }
  }

  componentDidMount() {
    axios.get((process.env.SERVER_URL || 'http://localhost:' +
    (process.env.SERVER_PORT || 8080)) + '/api/documents/get_type/' +
      this.props.match.params.docTypeId, { withCredentials: true })
      .then((res) => res.data)
      .then(data => { this.setState({ docType: data }); })
      .catch((err) => {
        console.log(err);
        console.log('Could not get document type.');
      });

    axios.get((process.env.SERVER_URL || 'http://localhost:' +
    (process.env.SERVER_PORT || 8080)) + '/api/documents/get_template/' +
      this.props.match.params.docTypeId, { withCredentials: true })
      .then((res) => res.data)
      .then(data => { this.setState({ template: data }); })
      .catch((err) => {
        console.log(err);
        console.log('Could not get document type.');
      });
  }

  render() {
    if (this.state.docType !== null && this.state.template !== null)
      return <GeneratedForm title={'Edit ' + this.state.docType.docTypeName +
        ' Display Template'} params={{
        templateBody: {
          type: 'text',
          label: 'Template Body',
          value: this.state.template !== null ?
            this.state.template.templateBody : ''
        }
      }} method="post"
      formAction={(process.env.SERVER_URL || 'http://localhost:' +
      (process.env.SERVER_PORT || 8080)) + '/api/documents/update_template/' +
      this.props.match.params.docTypeId} />;
    else return null;
  }
}

export default EditDisplayTemplate;
