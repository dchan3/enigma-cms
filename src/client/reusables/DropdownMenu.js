import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

var ContainerDiv = styled.div`
  width: fit-content;
  margin: auto;
  text-align: center;
`;

var TopLevelList = styled.ul`
  list-style-type: none;
  text-transform: uppercase;
  font-family: sans-serif;
  padding-left: 0;
  @media (min-width: 767px) {
    display: inline-flex;
  }
  background-color: cadetblue;
`;

var ListItem = styled.li`
  padding: 8px;
`;

var SubList = styled.ul`
  list-style-type: none;
  text-transform: uppercase;
  font-family: sans-serif;
  padding-left: 0;
  opacity: ${props => props.open ? '1' : '0' }
  visibility: ${props => props.open ? 'visible' : 'hidden' }
  -webkit-transition: opacity .5s;
  -moz-transition: opacity .5s;
  -o-transition: opacity .5s;
  transition: opacity .5s;
`;

var SubListItem = styled.li`
  padding: 8px 8px 0 8px;
`;

var HoverLink = styled.a`
  color: white;
  text-decoration: none;
  -webkit-transition: font-size .25s;
  -moz-transition: font-size .25s;
  -o-transition: font-size .25s;
  transition: font-size .25s;
  &:hover {
    text-decoration: underline;
    font-size: 1.2em;
  }
`;

var WhiteSpan = styled.span`
  color: white;
`;

class NodeLinkText extends Component {
  static propTypes = {
    url: PropTypes.string,
    text: PropTypes.string
  }

  render() {
    return <HoverLink href={this.props.url}>
      <span>{this.props.text}</span></HoverLink>;
  }
}

class LinkNode extends Component {
  static propTypes = {
    url: PropTypes.string,
    text: PropTypes.string
  }

  render() {
    return <ListItem>
      <NodeLinkText url={this.props.url} text={this.props.text} /></ListItem>;
  }
}

class SubLinkNode extends Component {
  static propTypes = {
    url: PropTypes.string,
    text: PropTypes.string
  }

  render() {
    return <SubListItem>
      <NodeLinkText url={this.props.url} text={this.props.text} />
    </SubListItem>;
  }
}

class SubMenu extends Component {
  static propTypes = {
    childNodes: PropTypes.array,
    url: PropTypes.string,
    text: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      open: false
    }
  }

  handleClick() {
    this.setState({ open: !this.state.open });
  }

  render() {
    return <ListItem>
      <NodeLinkText text={this.props.text} />
      <WhiteSpan onClick={this.handleClick}>{'▼'}</WhiteSpan>
      <SubList open={this.state.open}>
        {this.props.childNodes.map(child => <SubLinkNode url={child.url}
          text={child.text} />)}
      </SubList>
    </ListItem>;
  }
}

var renderMenuLinkNode = function(node) {
  return <LinkNode url={node.url} text={node.text} />
}

var renderMenuListNode = function(node) {
  return  (
    <SubMenu url={node.url} text={node.text} childNodes={node.childNodes} />
  );
}

var renderNode = function(node) {
  if (node.childNodes) return renderMenuListNode(node);
  else if (node.url) return renderMenuLinkNode(node);
}

class DropdownMenu extends Component {
  static propTypes = {
    menuNodes: PropTypes.array
  }

  render() {
    return <ContainerDiv>
      <TopLevelList>
        {this.props.menuNodes.map(node =>
          renderNode(node)
        )}
      </TopLevelList>
    </ContainerDiv>;
  }
}

export default DropdownMenu;
