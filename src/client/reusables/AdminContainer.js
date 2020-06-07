import { createElement } from 'preact';
import fromCss from '../contexts/FromCssContext';

/** @jsx h **/

let AdminContainer = fromCss('div',
  'width:90%;display:inline-block;height:100vh;overflow-y:scroll;');

export default AdminContainer;
