import { createElement } from 'preact';
import fromCss from '../utils/component_from_css';

/** @jsx h **/

let AdminContainer = fromCss('div',
  'width:90%;display:inline-block;height:100vh;overflow-y:scroll;');

export default AdminContainer;
