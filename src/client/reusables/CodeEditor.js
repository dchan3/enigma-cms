import React, { useState, useReducer } from 'react';
import styled  from 'styled-components';
import Prism from 'prismjs';
import { string } from 'prop-types';

let EditorContainer =
  styled.div`height:250px;position:relative;text-align:left;`,
  PreviewContainer = styled.div`
  background-color: white;
  border: thin gray solid;
  position: absolute;
  top: 20px;
  padding: 5px;
  resize: none;
  overflow-x: scroll;
  overflow-y: scroll;
  left: 0;
  height: 100%;
  width: calc(100% - 10px);`, TextInputArea = styled.textarea`
    background-color: transparent;
    overflow-wrap: break-word;
    top: 20px;
    left: 0;
    height: 100%;
    position: absolute;
    font-family: "Monaco", "Courier New", monospace;
    font-size: 16px;
    width: calc(100% - 10px);
    color: transparent;
    caret-color: black;
    padding: 5px;
    overflow-y: scroll;
    resize: none;
    z-index: 9;
    white-space: pre-wrap;
  `, CodeDisplayArea = styled.div`
    position: absolute;
    overflow-wrap: break-word;
    top: 20px;
    left: 0;
    font-size: 16px;
    background-color: cornflowerblue;
    font-family: "Monaco", "Courier New", monospace;
    padding: 5px;
    overflow-y: scroll;
    width: calc(100% - 10px);
    height: 100%;
    border: thin beige solid;
    z-index: 8;
    white-space: pre-wrap;
`;

function CodeEditor({ grammar, id, name, value }) {
  let [state, setState] = useState({
    value: value || ''
  });

  let [view, toggleView] = useReducer(function(curr) {
    return !curr;
  }, false);

  function handleChange({ target: { value } }) {
    setState({ value });
  }

  function handleScroll({ currentTarget }) {
    currentTarget.previousSibling.scrollTop = currentTarget.scrollTop;
  }

  return <EditorContainer>
    <button onClick={toggleView}>Switch to { view ? 'Code' : 'Preview'}</button>
    {view ?
      <PreviewContainer dangerouslySetInnerHTML={{ __html: state.value }} /> : [
        <CodeDisplayArea dangerouslySetInnerHTML={{ __html: state.value !== ''
        && Prism.highlight(state.value,  Prism.languages[grammar], grammar) ||
        '' }} />,
        <TextInputArea {...{ id, name }} value={state.value}
          onChange={handleChange} onScroll={handleScroll} />]}
  </EditorContainer>;
}

CodeEditor.propTypes = {
  grammar: string.isRequired,
  id: string.isRequired,
  name: string.isRequired,
  value: string
};

export default CodeEditor;
