import { h, createElement } from 'preact';
import fromCss from '../utils/component_from_css';

/** @jsx h **/

let ToolbarIconFrame = fromCss('div',
    'min-height:40px;max-height:40px;min-width:40px;max-width:40px;'),
  IconContent = fromCss('button', 'width:100%;height:100%;'),
  BoldIconSpan = fromCss('span', 'font-weight:900;font-size:18px;'),
  ItalicIconSpan = fromCss('span', 'font-style:italic;font-size:18px;'),
  UnderlineIconSpan = fromCss('span', 'text-decoration:underline;font-size:18px;'),
  StrikeThroughIconSpan = fromCss('span', 'text-decoration:line-through;font-size:18px;'),
  ToolbarWhole = fromCss('ul', 'list-style:none;display:inline-block;margin-bottom:0;'),
  ToolbarButton = fromCss('li', 'display:inline-block;');

function ToolbarIcon({ command, component: Component, label }) {
  function handleClick() {
    document.execCommand(command);
  }

  return <ToolbarButton><ToolbarIconFrame>
    <IconContent onClick={handleClick}>
      <Component>{label}</Component>
    </IconContent>
  </ToolbarIconFrame></ToolbarButton>
}

let iconData = [
  { command: 'bold', component: BoldIconSpan, label: 'B' },
  { command: 'italic', component: ItalicIconSpan, label: 'I' },
  { command: 'underline', component: UnderlineIconSpan, label: 'U' },
  { command: 'strikeThrough', component: StrikeThroughIconSpan, label: 'S' },
];

function CodeEditorToolbar() {
  return <ToolbarWhole>
    {iconData.map(icon => <ToolbarIcon {...icon} />)}
  </ToolbarWhole>;
}

export default CodeEditorToolbar;
