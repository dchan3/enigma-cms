import { h, createElement } from 'preact'; /** @jsx h **/
import useTheRouterContext from '../hooks/useTheRouterContext';
import fromCss from '../contexts/FromCssContext';

export default function SamePageAnchor({
  children, href, target, className, id, style
}) {
  let { history, setLocation } = useTheRouterContext(),
    Anchor = fromCss('a', 'font-weight:900;'), AlreadyOn = fromCss('span',
      'text-decoration:underline;font-weight:900;margin:0;width:fit-content;height:fit-content;');

  function handleClick(event) {
    if (history && href.startsWith('/')) {
      event.preventDefault();
      history.push(href);
      setLocation(href);
    }
    else if (href.startsWith('/')) setLocation(href);
  }

  return (history && history.location.pathname !== href) ?
    <Anchor href={href} target={target} className={className} id={id}
      style={style} onClick={handleClick}>{children}</Anchor> :
    <AlreadyOn>{children}</AlreadyOn>;
}
