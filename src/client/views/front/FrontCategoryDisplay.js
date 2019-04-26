import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Handlebars from 'handlebars';
import { Redirect } from 'react-router';

class FrontCategoryDisplay extends Component {
  static propTypes = {
    match: PropTypes.object,
    staticContext: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {
    let { config, dataObj } = this.props.staticContext,
      { categoryTemplateBody, items } = dataObj;

    if (categoryTemplateBody && items) {
      config.shortcodes.forEach(
        function(shortcode) {
          Handlebars.registerHelper(shortcode.name,
            new Function(shortcode.args, shortcode.code));
        });

      let template = Handlebars.compile(categoryTemplateBody),
        newItems = items.map(item => ({
          ...item.content,
          slug: item.slug,
          createdAt: item.createdAt,
          editedAt: item.editedAt
        }));
      return <div dangerouslySetInnerHTML=
        {{ __html: template({ items: newItems }) }}>
      </div>;
    }

    return <Redirect to='/not-found' />;
  }
}

export default FrontCategoryDisplay;