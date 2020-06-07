import { createElement } from 'preact'; /** @jsx h **/
import fromCss from '../contexts/FromCssContext';

export const StyledDiv = fromCss('div',
  'font-family:sans-serif;text-align:center;');

export const TextHeader = fromCss('h1',
  'text-align:center;text-transform:uppercase;font-family:sans-serif;');

export const PreviewImage = fromCss('img', 'height:100px;width:auto;');

export const ProfileImage = fromCss('img', 'max-width:100px;');
