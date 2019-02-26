import React, { Component } from 'react';
import styled from 'styled-components';
import Prism from 'prismjs';
import PropTypes from 'prop-types';

var EditorContainer = styled.div`
  height: 250px;
`, TextInputArea = styled.textarea`
  background-color: transparent;
  height: 250px;
  top: -262px;
  position: relative;
  font-family: "Monaco", "Courier New", monospace;
  font-size: 16px;
  width: calc(100% - 10px);
  color: transparent;
  caret-color: black;
  padding: 5px;
  z-index: 9;
`, CodeDisplayArea = styled.div`
  font-size: 16px;
  background-color: saddlebrown;
  font-family: "Monaco", "Courier New", monospace;
  padding: 5px;
  overflow-y: scroll;
  width: calc(100% - 10px);
  height: 250px;
  border: thin beige solid;
  z-index: 10;
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

    this.handleChange = this.handleChange.bind(this)

    this.state = {
      value: this.props.value || '',
      cursorPos: 0
    }
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    var handleChange = this.handleChange;

    return [
      <EditorContainer>
        <CodeDisplayArea dangerouslySetInnerHTML={{ __html:
          this.state.value !== '' && Prism.highlight(
            this.state.value, Prism.languages[this.props.grammar],
            this.props.grammar) || ''
        }} />
        <TextInputArea id={this.props.id} name={this.props.name}
          value={this.state.value} onChange={handleChange}/>
      </EditorContainer>
    ]
  }
}

export default CodeEditor;
