import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Handlebars from 'handlebars';
import { Redirect } from 'react-router';

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

      let template = Handlebars.compile(templateBody);
      return <div dangerouslySetInnerHTML=
        {{ __html: template(
          { ...doc.content,
            createdAt: doc.createdAt,
            editedAt: doc.editedAt
          }) }}>
      </div>;
    }
    else
      return <Redirect to='/not-found' />;
  }
}

export default FrontDocumentDisplay;
