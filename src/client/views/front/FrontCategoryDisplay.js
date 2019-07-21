import React, { useEffect, useState } from 'react';
import { object } from 'prop-types';
import Handlebars from 'handlebars';
import { Redirect } from 'react-router-dom';
import { Metamorph } from 'react-metamorph';
import { get as axget } from 'axios';

function FrontCategoryDisplay({ staticContext, match: { params: { docType
} } }) {
  let [state, setState] = useState({
    dataObj: staticContext.dataObj &&
      staticContext.dataObj.docTypeNamePlural &&
      staticContext.dataObj.docTypeNamePlural === docType &&
      staticContext.dataObj || null
  });

  useEffect(function() {
    let { dataObj } = state;
    if (!dataObj) {
      axget(
        `/api/documents/get_documents_by_type_name/${docType}`)
        .then(
          ({ data }) => {
            setState({ dataObj: data })
          })
    }
  }, []);

  let { config: { shortcodes, siteName } } = staticContext, { dataObj } = state;
  if (dataObj === undefined) return <Redirect to='/not-found' />;
  else if (dataObj) {
    let { categoryTemplateBody, items, docTypeNamePlural } = dataObj;

    if (categoryTemplateBody && items) {
      shortcodes.forEach(
        function({ name, args, code }) {
          Handlebars.registerHelper(name, new Function(args.join(','), code));
        });

      let template = Handlebars.compile(categoryTemplateBody),
        newItems = items.map(({ content, slug, createdAt, editedAt }) => ({
          ...content, slug, createdAt, editedAt
        }));
      return [<Metamorph title={`${docTypeNamePlural.charAt(0).toUpperCase() +
      docTypeNamePlural.slice(1)} | ${siteName}`}
      description={`${docTypeNamePlural.charAt(0).toUpperCase() +
        docTypeNamePlural.slice(1)} on ${siteName}`} />,
      <div dangerouslySetInnerHTML={{ __html:
        template({ items: newItems }) }} />
      ];
    }
  }

  return null;
}

FrontCategoryDisplay.propTypes = {
  match: object,
  staticContext: object
};

export default FrontCategoryDisplay;
