import React, { Component } from 'react';
import { object } from 'prop-types';
import { GeneratedForm } from '../../reusables';

class EditDisplayTemplate extends Component {
  static propTypes = {
    match: object,
    staticContext: object
  };

  constructor(props) {
    super(props);
  }

  render() {
    let { docType, templateBody, categoryTemplateBody } =
      this.props.staticContext.dataObj;
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
