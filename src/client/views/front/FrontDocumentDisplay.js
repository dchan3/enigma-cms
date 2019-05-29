import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Handlebars from 'handlebars';
import { Redirect } from 'react-router-dom';
import { Metamorph } from 'react-metamorph';

class FrontDocumentDisplay extends Component {
  static propTypes = {
    match: PropTypes.object,
    staticContext: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {
    let { config, dataObj } = this.props.staticContext,
      { templateBody, doc } = dataObj;

    if (templateBody && doc) {
      config.shortcodes.forEach(
        function(shortcode) {
          Handlebars.registerHelper(shortcode.name,
            new Function(shortcode.args.join(','), shortcode.code));
        });

      let template = Handlebars.compile(templateBody), hdr = null, attrs = {};

      let ks = Object.keys(doc.content),
        titleKey = ks.find(k => k.match(/title|name/i)),
        summaryKey = ks.find(k => k.match(/summary|description|synopsis/i)),
        pictureKey = ks.find(k => k.match(/image|img|picture|pic|photo/i)),
        tagsKey = ks.find(k => k.match(/tags|keywords|buzzwords/i));

      if (titleKey) attrs.title =
        `${doc.content[titleKey]} | ${config.siteName}`;
      if (summaryKey) attrs.description = doc.content[summaryKey];
      if (pictureKey) attrs.image = doc.content[pictureKey];
      if (tagsKey) attrs.keywords = typeof doc.content[tagsKey] === 'string' ?
        [doc.content[tagsKey], ...config.keywords] :
        [...doc.content[tagsKey], ...config.keywords];

      if (Object.keys(attrs).length > 0) {
        hdr = <Metamorph {...attrs} />;
      }

      return [hdr, <div dangerouslySetInnerHTML=
        {{ __html: template(
          { ...doc.content,
            createdAt: doc.createdAt,
            editedAt: doc.editedAt
          }) }} />];
    }
    else
      return <Redirect to='/not-found' />;
  }
}

export default FrontDocumentDisplay;
