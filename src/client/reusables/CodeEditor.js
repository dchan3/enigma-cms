import React, { useContext, useMemo, useState } from 'react';
import fromCss from '../utils/component_from_css';
import CodeEditorContext, { CodeEditorContextProvider } from './CodeEditorContext';
import CodeEditorToolbar from './CodeEditorToolbar';

let EditorContainer = fromCss('div', 'height:250px;text-align:left;'),
  PreviewContainer = fromCss('div',
    'background-color:white;border:thin gray solid;padding:5px;resize:none;overflow-x:scroll;overflow-y:scroll;left:0;height:85%;width:calc(100% - 10px);'),
  TextInputArea = fromCss('textarea',
    'background-color:white;overflow-wrap:break-word;left:0;height:85%;font-family:"Monaco","Courier New",monospace;font-size:16px;width:calc(100% - 10px);caret-color:black;padding:5px;overflow-y:scroll;resize:none;z-index:9;white-space:pre-wrap;');

function PreviewBox() {
  let [dummy,] = useState(false),
    { state, setState } = useContext(CodeEditorContext);

  function handlePreviewChange({ target: { innerHTML: value } }) {
    setState({ value });
  }

  return useMemo(() => {
    return <PreviewContainer contentEditable onInput={handlePreviewChange}
      onBlur={handlePreviewChange}
      dangerouslySetInnerHTML={{ __html: state.value }} />
  }, [dummy]);
}

function Preview() {
  return <div>
    <CodeEditorToolbar />
    <PreviewBox />
  </div>
}

function CodeEditor({ id, name }) {
  let { state, setState, view, toggleView } = useContext(CodeEditorContext);

  function handleChange({ target: { value } }) {
    setState({ value });
  }

  function handleScroll({ currentTarget }) {
    currentTarget.previousSibling.scrollTop = currentTarget.scrollTop;
  }

  return <EditorContainer>
    <button onClick={toggleView}>Switch to { view ? 'Code' : 'Preview'}</button>
    {view ? <Preview /> :
      <TextInputArea {...{ id, name }} value={state.value}
        onChange={handleChange} onScroll={handleScroll} />}
  </EditorContainer>;
}

export default ({ id, name, value }) => <CodeEditorContextProvider value={value}>
  <CodeEditor id={id} name={name}/></CodeEditorContextProvider>;
