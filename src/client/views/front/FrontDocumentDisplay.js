import React, { useState, useEffect } from 'react';
import { get as axget } from 'axios';
import { object } from 'prop-types';
import Handlebars from 'handlebars';
import { Redirect } from 'react-router-dom';
import { Metamorph } from 'react-metamorph';

function FrontDocumentDisplay({
  staticContext, match: { params: { docType, docNode } } }) {
  let [state, setState] = useState({
    dataObj: staticContext.dataObj &&
      staticContext.dataObj.docTypeNamePlural &&
      staticContext.dataObj.docTypeNamePlural === docType &&
      staticContext.dataObj.doc && staticContext.dataObj.doc.slug === docNode &&
      staticContext.dataObj || null
  });

  useEffect(function() {
    let { dataObj } = staticContext;
    if (!dataObj) {
      axget(
        `/api/documents/get_document_by_type_and_slug/${docType}/${docNode}`)
        .then(
          ({ data }) => {
            setState({ dataObj: data })
          })
    }
  }, []);

  let { dataObj } = state, { config: { shortcodes, keywords, siteName } } =
    staticContext;

  if (dataObj === undefined) return <Redirect to='/not-found' />;
  else if (dataObj) {
    let { templateBody, doc, authorInfo } = dataObj;
    if (templateBody && doc) {
      shortcodes.forEach(
        function({ name, args, code }) {
          Handlebars.registerHelper(name, new Function(args.join(','), code));
        });

      let template = Handlebars.compile(templateBody),
        { content, createdAt, editedAt } = doc, attrs = {
          title: content['title'] || content['name'] || '',
          description: content['description'] || content['summary'] ||
            content['synopsis'] || '',
          image: content['image'] || content['img'] || content['picture'] ||
           content['pic'] || content['photo'],
          keywords: content['tags'] || content['keywords'] ||
            content['buzzwords'] || ''
        };

      attrs.title += attrs.title.length ? ` | ${siteName}` : siteName;
      attrs.keywords = typeof attrs.keywords === 'string' ?
        [attrs.keywords, ...keywords] : [attrs.keywords, ...keywords];

      return [<Metamorph {...attrs} />, <div dangerouslySetInnerHTML=
        {{ __html:
          template({ ...content, createdAt, editedAt, authorInfo }) }} />];
    }
  }
  return null;
}

FrontDocumentDisplay.propTypes = {
  match: object,
  staticContext: object
};

export default FrontDocumentDisplay;
