import React, { useState, useReducer } from 'react';
import styled  from 'styled-components';
import { string } from 'prop-types';

let EditorContainer =
  styled.div`height:250px;text-align:left;`,
  PreviewContainer = styled.div`
  background-color: white;
  border: thin gray solid;
  padding: 5px;
  resize: none;
  overflow-x: scroll;
  overflow-y: scroll;
  left: 0;
  height: 100%;
  width: calc(100% - 10px);`, TextInputArea = styled.textarea`
    background-color: white;
    overflow-wrap: break-word;
    left: 0;
    height: 100%;
    font-family: "Monaco", "Courier New", monospace;
    font-size: 16px;
    width: calc(100% - 10px);
    caret-color: black;
    padding: 5px;
    overflow-y: scroll;
    resize: none;
    z-index: 9;
    white-space: pre-wrap;
  `;

function CodeEditor({ id, name, value }) {
  let [state, setState] = useState({
    value: value || ''
  });

  let [view, toggleView] = useReducer(function(curr) {
    return !curr;
  }, false);

  function handleChange({ target: { value } }) {
    setState({ value });
  }

  function handlePreviewChange({ target: { innerHTML: value } }) {
    setState({ value });
  }

  function handleScroll({ currentTarget }) {
    currentTarget.previousSibling.scrollTop = currentTarget.scrollTop;
  }

  return <EditorContainer>
    <button onClick={toggleView}>Switch to { view ? 'Code' : 'Preview'}</button>
    {view ?
      <PreviewContainer contentEditable onInput={handlePreviewChange}
        onBlur={handlePreviewChange}
        dangerouslySetInnerHTML={{ __html: state.value }} /> :
      <TextInputArea {...{ id, name }} value={state.value}
        onChange={handleChange} onScroll={handleScroll} />}
  </EditorContainer>;
}

CodeEditor.propTypes = {
  grammar: string.isRequired,
  id: string.isRequired,
  name: string.isRequired,
  value: string
};

export default CodeEditor;
