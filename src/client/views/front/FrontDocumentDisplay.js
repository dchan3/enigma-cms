import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Handlebars from 'handlebars';
import FrontMenu from '../../reusables/FrontMenu';
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
            new Function(shortcode.args, shortcode.code));
        });

      let template = Handlebars.compile(templateBody);
      return <div>
        <div>
          <h1 className="front-header">
            {config ? config.siteName : 'My Website'}</h1>
        </div>
        <FrontMenu config={config} />
        <div dangerouslySetInnerHTML=
          {{ __html: template(
            { ...doc.content,
              createdAt: doc.createdAt,
              editedAt: doc.editedAt
            }) }}>
        </div>
      </div>;
    }
    else
      return <Redirect to='/not-found' />;
  }
}

export default FrontDocumentDisplay;
