import { h } from 'preact'; /** @jsx h **/
import { GeneratedForm } from '../../reusables/back_exports';
import useFrontContext from '../../hooks/useFrontContext';

function EditDisplayTemplate() {
  let { state } = useFrontContext({
      dataParams: ['docTypeId'],
      urlParams: ['docTypeId'],
      apiUrl: function({ docTypeId }) {
        return `documents/get_template/${docTypeId}`;
      }
    }), { dataObj } = state;

  if (dataObj) {
    let { docType, templateBody, categoryTemplateBody } = dataObj;

    if (docType !== null && templateBody !== null
      && categoryTemplateBody !== null) {
      let { docTypeName, docTypeId } = docType;
      return <GeneratedForm title={
        `Edit ${docTypeName} Display Template`}
      currentValue={{ ...{ templateBody, categoryTemplateBody } }}params={{
        templateBody: {
          type: 'text',
          grammar: 'html'
        },
        categoryTemplateBody: {
          type: 'text',
          grammar: 'html'
        } }} redirectUrl='/admin'
      formAction={`documents/update_template/${docTypeId}`} />;
    }
  }
  return null;
}

export default EditDisplayTemplate;
