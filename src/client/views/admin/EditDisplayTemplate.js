import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GeneratedForm from '../../reusables/GeneratedForm';

class EditDisplayTemplate extends Component {
  static propTypes = {
    match: PropTypes.object,
    staticContext: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {
    let { docType, templateBody } =
      this.props.staticContext.dataObj,
      categoryTemplateBody =
        this.props.staticContext.dataObj.categoryTemplateBody || '';
    if (docType !== null && templateBody !== null)
      return <GeneratedForm title=
        {`Edit ${docType.docTypeName} Display Template`} params={{
        templateBody: {
          type: 'text',
          grammar: 'html',
          value: templateBody
        },
        categoryTemplateBody: {
          type: 'text',
          grammar: 'html',
          value: categoryTemplateBody
        }
      }} method="post" redirectUrl='/admin'
      formAction={
        `/api/documents/update_template/${this.props.match.params.docTypeId}`}
      />;
    else return null;
  }
}

export default EditDisplayTemplate;
