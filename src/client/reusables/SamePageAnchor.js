import React from 'react';
import useGeneralContext from '../hooks/useGeneralContext';
import fromCss from '../utils/component_from_css';

function SamePageAnchor({
  children, href, target, className, id, style
}) {
  let { generalState, setGeneralState } = useGeneralContext(),
    Anchor = fromCss('a', 'font-weight:900;'), AlreadyOn = fromCss('span',
      'text-decoration:underline;font-weight:900;margin:0;width:fit-content;height:fit-content;');

  function handleClick(event) {
    if (generalState && href.startsWith('/')) {
      event.preventDefault();
      let newState = Object.assign({}, generalState);
      newState.history.push(href);
      setGeneralState(newState);
    }
  }

  return (generalState && generalState.history &&
    generalState.history.location.pathname !== href) ?
    <Anchor href={href} target={target} className={className} id={id}
      style={style} onClick={handleClick}>{children}</Anchor> :
    <AlreadyOn>{children}</AlreadyOn>;
}

export default SamePageAnchor;
