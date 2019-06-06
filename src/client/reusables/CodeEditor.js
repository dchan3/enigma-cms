import React, { useState } from 'react';
import styled  from 'styled-components';
import Prism from 'prismjs';
import { string } from 'prop-types';

let EditorContainer = styled.div`
  height: 250px;
  position: relative;
  text-align: left;
`, TextInputArea = styled.textarea`
  background-color: transparent;
  overflow-wrap: break-word;
  top: 0;
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
  top: 0;
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

  function handleChange(event) {
    setState({ value: event.target.value });
  }

  function handleScroll(event) {
    if (event) {
      event.currentTarget.previousSibling.scrollTop =
        event.currentTarget.scrollTop;
    }
  }

  return [
    <EditorContainer>
      <CodeDisplayArea dangerouslySetInnerHTML={{ __html:
        state.value !== '' && Prism.highlight(
          state.value, Prism.languages[grammar], grammar) || ''
      }} />
      <TextInputArea id={id} name={name} value={state.value}
        onChange={handleChange} onScroll={handleScroll} />
    </EditorContainer>
  ]
}

CodeEditor.propTypes = {
  grammar: string.isRequired,
  id: string.isRequired,
  name: string.isRequired,
  value: string
}

export default CodeEditor;
