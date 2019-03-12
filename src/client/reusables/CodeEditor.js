import React, { Component } from 'react';
import styled from 'styled-components';
import Prism from 'prismjs';
import PropTypes from 'prop-types';

var EditorContainer = styled.div`
  height: 250px;
  position: relative;
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

class CodeEditor extends Component {
  static propTypes = {
    grammar: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string
  }

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleScroll = this.handleScroll.bind(this);

    this.state = {
      value: this.props.value || '',
      cursorPos: 0
    }
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleScroll(event) {
    if (event) {
      event.currentTarget.previousSibling.scrollTop =
        event.currentTarget.scrollTop;
    }
  }

  render() {
    var handleChange = this.handleChange, handleScroll = this.handleScroll;

    return [
      <EditorContainer>
        <CodeDisplayArea dangerouslySetInnerHTML={{ __html:
          this.state.value !== '' && Prism.highlight(
            this.state.value, Prism.languages[this.props.grammar],
            this.props.grammar) || ''
        }} />
        <TextInputArea id={this.props.id} name={this.props.name}
          value={this.state.value} onChange={handleChange}
          onScroll={handleScroll} />
      </EditorContainer>
    ]
  }
}

export default CodeEditor;
