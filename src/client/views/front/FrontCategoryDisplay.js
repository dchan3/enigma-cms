import React from 'react';
import TheRedirect from '../../the_router/TheRedirect';
import Fedora from '../../reusables/Fedora';
import InnerHtmlRenderer from '../../utils/inner_html_renderer';
import useFrontContext from '../../hooks/useFrontContext.js';

function FrontCategoryDisplay() {
  let { state } = useFrontContext({
    dataParams: ['docTypeNamePlural'],
    urlParams: ['docType'],
    apiUrl: function({ docType }) {
      return `documents/get_rendered_documents_by_type_name/${docType}`;
    }
  });

  let { dataObj } = state;

  if (dataObj === undefined) return <TheRedirect to='/not-found' />;
  else if (dataObj && dataObj.metadata && dataObj.rendered) {
    return [<Fedora {...dataObj.metadata} />,
      <div><InnerHtmlRenderer innerHtml={dataObj.rendered} /></div>
    ];
  }

  return null;
}

export default FrontCategoryDisplay;
