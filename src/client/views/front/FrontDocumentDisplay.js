import React from 'react';
import { object } from 'prop-types';
import Handlebars from 'handlebars';
import { Redirect } from 'react-router-dom';
import { Metamorph } from 'react-metamorph';

function FrontDocumentDisplay({
  staticContext: { config: { shortcodes, siteName, keywords }, dataObj: {
    templateBody, doc } } }) {
  if (templateBody && doc) {
    shortcodes.forEach(
      function({ name, args, code }) {
        Handlebars.registerHelper(name, new Function(args.join(','), code));
      });

    let template = Handlebars.compile(templateBody), hdr = null, attrs = {},
      { content, createdAt, editedAt } = doc, ks = Object.keys(content),
      titleKey = ks.find(k => k.match(/title|name/i)),
      summaryKey = ks.find(k => k.match(/summary|description|synopsis/i)),
      pictureKey = ks.find(k => k.match(/image|img|picture|pic|photo/i)),
      tagsKey = ks.find(k => k.match(/tags|keywords|buzzwords/i));

    if (titleKey) attrs.title = `${content[titleKey]} | ${siteName}`;
    if (summaryKey) attrs.description = content[summaryKey];
    if (pictureKey) attrs.image = content[pictureKey];
    if (tagsKey) attrs.keywords = typeof content[tagsKey] === 'string' ?
      [content[tagsKey], ...keywords] : [...content[tagsKey], ...keywords];

    if (Object.keys(attrs).length) {
      hdr = <Metamorph {...attrs} />;
    }

    return [hdr, <div dangerouslySetInnerHTML=
      {{ __html: template({ ...content, createdAt, editedAt }) }} />];
  }
  else
    return <Redirect to='/not-found' />;
}

FrontDocumentDisplay.propTypes = {
  match: object,
  staticContext: object
};

export default FrontDocumentDisplay;
