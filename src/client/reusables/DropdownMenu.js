import React from 'react';
import { array, string } from 'prop-types';
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

var ListItem = styled.li`padding: 8px;`;

var SubList = styled.ul`
  list-style-type: none;
  text-transform: uppercase;
  font-family: sans-serif;
  padding-left: 0;
  opacity: ${({ open }) => open ? '1' : '0' }
  visibility: ${({ open }) => open ? 'visible' : 'hidden' }
  -webkit-transition: opacity .5s;
  -moz-transition: opacity .5s;
  -o-transition: opacity .5s;
  transition: opacity .5s;
`;

var SubListItem = styled.li`padding: 8px 8px 0 8px;`;

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

var WhiteSpan = styled.span`color: white;`;

function NodeLinkText({ url, text }) {
  return <HoverLink href={url}><span>{text}</span></HoverLink>;
}

NodeLinkText.propTypes = {
  url: string,
  text: string
};

function LinkNode({ url, text }) {
  return <ListItem><NodeLinkText url={url} text={text} /></ListItem>;
}

LinkNode.propTypes = {
  url: string,
  text: string
};

function SubLinkNode({ url, text }) {
  return <SubListItem>
    <NodeLinkText url={url} text={text} />
  </SubListItem>;
}

SubLinkNode.propTypes = {
  url: string,
  text: string
};

function SubMenu({ childNodes, text: labelText }){
  return <ListItem>
    <NodeLinkText text={labelText} />
    <WhiteSpan>{'▼'}</WhiteSpan>
    <SubList>
      {childNodes.map(({ url, text }) =>
        <SubLinkNode url={url} text={text} />)}
    </SubList>
  </ListItem>;
}

SubMenu.propTypes = {
  childNodes: array,
  url: string,
  text: string
};

function DropdownMenu({ menuNodes }) {
  function renderNode(node) {
    return (node.childNodes) ? <SubMenu {...node} /> : <LinkNode {...node} />;
  }

  return <ContainerDiv>
    <TopLevelList>
      {menuNodes.map(node => renderNode(node))}
    </TopLevelList>
  </ContainerDiv>;
}

DropdownMenu.propTypes = {
  menuNodes: array
};

export default DropdownMenu;
