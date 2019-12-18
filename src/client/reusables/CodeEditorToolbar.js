import React from 'react';
import fromCss from '../utils/component_from_css';

let ToolbarIconFrame = fromCss('div', 'min-height:40px;max-height:40px;min-width:40px;max-width:40px;'),
  IconContent = fromCss('button', 'width:100%;height:100%;'),
  BoldIconSpan = fromCss('span', 'font-weight:900;font-size:18px;'),
  ItalicIconSpan = fromCss('span', 'font-style:italic;font-size:18px;'),
  UnderlineIconSpan = fromCss('span', 'text-decoration:underline;font-size:18px;'),
  StrikeThroughIconSpan = fromCss('span', 'font-style:strike-through;font-size:18px'),
  ToolbarWhole = fromCss('ul', 'list-style:none;display:inline-block;'),
  ToolbarButton = fromCss('li', 'display:inline-block;');

function ToolbarIcon({ command, component: Component, label }) {
  function handleClick() {
    document.execCommand(command);
  }

  return <ToolbarIconFrame>
    <IconContent onClick={handleClick}>
      <Component>{label}</Component>
    </IconContent>
  </ToolbarIconFrame>
}

function CodeEditorToolbar() {
  return <ToolbarWhole>
    <ToolbarButton><ToolbarIcon command='bold' component={BoldIconSpan} label="B" /></ToolbarButton>
    <ToolbarButton><ToolbarIcon command='italic' component={ItalicIconSpan} label="I" /></ToolbarButton>
    <ToolbarButton><ToolbarIcon command='underline' component={UnderlineIconSpan} label="U" /></ToolbarButton>
    <ToolbarButton><ToolbarIcon command='strikeThrough' component={StrikeThroughIconSpan} label="S" /></ToolbarButton>
  </ToolbarWhole>;
}

export default CodeEditorToolbar;
