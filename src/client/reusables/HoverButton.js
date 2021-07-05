import { h } from 'preact'; /** @jsx h **/
import fromCss from '../contexts/FromCssContext';

/** @jsx h **/
export default fromCss('p',
  { '&':
    'opacity:0;position:absolute;margin:0 auto;top:50%;height:fit-content;left:0;right:0;width:70%;text-align: center;background:white;padding:4px;border-radius:20px;box-shadow:grey 2px 2px;font-family:sans-serif;',
  '&:hover': 'opacity:1;cursor:pointer;'
  });