import React, { useEffect, useState, useContext } from 'react';
import Handlebars from 'handlebars';
import { Redirect } from 'react-router-dom';
import { Metamorph } from 'react-metamorph';
import { get as axget } from 'axios';
import GeneralContext from '../../contexts/GeneralContext';

function FrontCategoryDisplay() {
  let { generalState } = useContext(GeneralContext),
    { staticContext, match: { params: { docType } } } = generalState,
    [state, setState] = useState({
      dataObj: staticContext.dataObj &&
      staticContext.dataObj.docTypeNamePlural &&
      staticContext.dataObj.docTypeNamePlural === docType &&
      staticContext.dataObj || null
    });

  useEffect(function() {
    let { dataObj } = state;
    if (!dataObj || (dataObj && dataObj.docTypeNamePlural && dataObj.doc)) {
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

export default FrontCategoryDisplay;
