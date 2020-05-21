import { h, createElement } from 'preact';
import { useContext, useMemo, useState } from 'preact/hooks';
import fromCss from '../utils/component_from_css';
import CodeEditorContext, { CodeEditorContextProvider } from './CodeEditorContext';
import CodeEditorToolbar from './CodeEditorToolbar';
import htmlToJsx from '../utils/html_to_jsx';

/** @jsx h **/

let EditorContainer = fromCss('div', 'height:250px;text-align:left;'),
  PreviewContainer = fromCss('div',
    'background-color:white;border:thin gray solid;padding:5px;resize:none;overflow-x:scroll;overflow-y:scroll;left:0;height:100%;width:calc(100% - 10px);'),
  TextInputArea = fromCss('textarea',
    'background-color:white;overflow-wrap:break-word;left:0;height:85%;font-family:"Monaco","Courier New",monospace;font-size:16px;width:calc(100% - 10px);caret-color:black;padding:5px;overflow-y:scroll;resize:none;z-index:9;white-space:pre-wrap;'),
  PreviewOverall = fromCss('div', 'height:100%');
function PreviewBox() {
  let [dummy,] = useState(false),
    { state, setState } = useContext(CodeEditorContext);

  function handlePreviewChange({ target: { innerHTML: value } }) {
    var newVal = value.replace(/<(img|br)[^<>]*>/g, (m, p1) => `<${p1} />`);

    setState({ value: newVal });
  }

  return useMemo(() => {
    return <PreviewContainer contentEditable onInput={handlePreviewChange}
      onBlur={handlePreviewChange}>
      {htmlToJsx(state.value)}
    </PreviewContainer>;
  }, [dummy]);
}

function Preview() {
  return <PreviewOverall>
    <CodeEditorToolbar />
    <PreviewBox />
  </PreviewOverall>;
}

function CodeEditor({ id, name }) {
  let { state, setState, view, toggleView } = useContext(CodeEditorContext);

  function handleChange({ target: { value } }) {
    setState({ value });
  }

  return <EditorContainer>
    <button onClick={toggleView}>Switch to { view ? 'Code' : 'Preview'}</button>
    {view ? <Preview /> :
      <TextInputArea {...{ id, name }} value={state.value}
        onChange={handleChange} />}
  </EditorContainer>;
}

export default ({ id, name, value }) => <CodeEditorContextProvider initialValue={value}>
  <CodeEditor id={id} name={name}/></CodeEditorContextProvider>;
