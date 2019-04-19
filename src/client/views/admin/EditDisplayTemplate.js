import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GeneratedForm from '../../reusables/GeneratedForm';
import { default as urlUtils } from '../../../lib/utils';

class EditDisplayTemplate extends Component {
  static propTypes = {
    match: PropTypes.object,
    staticContext: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  redirect() {
    window.location.href = '/admin';
  }

  render() {
    let { docType, templateBody } = this.props.staticContext.dataObj;
    if (docType !== null && templateBody !== null)
      return <GeneratedForm title=
        {`Edit ${docType.docTypeName} Display Template`} params={{
        templateBody: {
          type: 'text',
          label: 'Template Body',
          grammar: 'html',
          value: templateBody
        }
      }} method="post" successCallback={this.redirect}
      formAction={urlUtils.info.path(
        `/api/documents/update_template/${this.props.match.params.docTypeId}`)}
      />;
    else return null;
  }
}

export default EditDisplayTemplate;
