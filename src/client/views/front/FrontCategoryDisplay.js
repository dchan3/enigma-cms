import React from 'react';
import { object } from 'prop-types';
import Handlebars from 'handlebars';
import { Redirect } from 'react-router-dom';
import { Metamorph } from 'react-metamorph';

function FrontCategoryDisplay({ staticContext }) {
  let { config: { shortcodes, siteName }, dataObj } = staticContext;
  if (!dataObj) return <Redirect to='/not-found' />;
  let  { categoryTemplateBody, items, typeName } = dataObj;

  if (categoryTemplateBody && items) {
    shortcodes.forEach(
      function({ name, args, code }) {
        Handlebars.registerHelper(name, new Function(args.join(','), code));
      });

    let template = Handlebars.compile(categoryTemplateBody),
      newItems = items.map(({ content, slug, createdAt, editedAt }) => ({
        ...content, slug, createdAt, editedAt
      }));
    return [<Metamorph title={`${typeName.charAt(0).toUpperCase() + 
    typeName.slice(1)} | ${siteName}`}
    description={`${typeName.charAt(0).toUpperCase() +
      typeName.slice(1)} on ${siteName}`} />,
    <div dangerouslySetInnerHTML=
      {{ __html: template({ items: newItems }) }} />];
  }

  return <Redirect to='/not-found' />;
}

FrontCategoryDisplay.propTypes = {
  match: object,
  staticContext: object
};

export default FrontCategoryDisplay;
