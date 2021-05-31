import { h } from 'preact';
import fromCss from '../contexts/FromCssContext';

/** @jsx h **/

let AdminFrame = fromCss('div',
  'width:100%;display:inline-block;height:100vh;overflow-y:scroll;');

export default AdminFrame;
