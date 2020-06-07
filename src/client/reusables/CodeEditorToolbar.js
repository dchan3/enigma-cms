import { h, createElement } from 'preact';
import { useContext } from 'preact/hooks';
import fromCss from '../contexts/FromCssContext';
import CodeEditorContext from './CodeEditorContext';

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
  let { setState } = useContext(CodeEditorContext);

  function handleClick() {
    if (document.execCommand) document.execCommand(command);
    else if (document.getSelection().rangeCount) {
      switch(command) {
      case 'bold':
        if (document.getSelection().getRangeAt(0).startContainer.innerHTML &&
          document.getSelection().getRangeAt(0).startContainer.innerHTML.indexOf('<strong>') <= -1)
          document.getSelection().getRangeAt(0).startContainer.innerHTML =
          document.getSelection().getRangeAt(0).startContainer.innerHTML
            .replace(document.getSelection().getRangeAt(0).toString(),
              `<strong>${document.getSelection().getRangeAt(0).toString()}</strong>`);
        else if (document.getSelection().getRangeAt(0).startContainer.innerHTML)
          document.getSelection().getRangeAt(0).startContainer.innerHTML =
            document.getSelection().getRangeAt(0).startContainer.innerHTML.replace(/<strong>/, '').replace(/<\/strong>/, '');
        else if (document.getSelection().getRangeAt(0).startContainer.constructor.name === 'Text') {
          let { startContainer, startOffset, endOffset } = document.getSelection().getRangeAt(0);
          document.getSelection().getRangeAt(0).startContainer
            .parentElement.innerHTML = `${startContainer
              .parentElement.innerHTML.substring(0, startOffset)}<strong>${startContainer
              .parentElement.innerHTML.substring(startOffset, endOffset)}</strong>${
              startContainer.parentElement.innerHTML.substring(
                endOffset
              )}`;
        }
        break;
      }

      setState({
        value: document.querySelector('div[contenteditable]').innerHTML
      });
    }
  }

  return <ToolbarButton><ToolbarIconFrame>
    <IconContent onClick={handleClick}>
      <Component>{label}</Component>
    </IconContent>
  </ToolbarIconFrame></ToolbarButton>;
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
