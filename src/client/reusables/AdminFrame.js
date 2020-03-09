import { createElement } from 'preact';
import fromCss from '../utils/component_from_css';

/** @jsx h **/

let AdminFrame = fromCss('div',
  'width:100%;display:inline-block;height:100vh;overflow-y:scroll;');

export default AdminFrame;
