import React from 'react';
import { array, string } from 'prop-types';
import styled from 'styled-components';

let urlText = { url: string, text: string },
  ContainerDiv = styled.div`width:fit-content;margin:auto;text-align:center;`,
  TopLevelList = styled.ul`
  list-style-type: none;
  text-transform: uppercase;
  font-family: sans-serif;
  padding-left: 0;
  @media (min-width: 767px) {
    display: inline-flex;
  }
  background-color: cadetblue;
`, ListItem = styled.li`padding:8px;`, SubList = styled.ul`
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
`, SubListItem = styled.li`padding:8px 8px 0 8px;`, HoverLink = styled.a`
  color: white;
  text-decoration: none;
  -webkit-transition: font-size .25s;
  -moz-transition: font-size .25s;
  -o-transition: font-size .25s;
  transition: font-size .25s;
  &:hover{text-decoration:underline;font-size:1.2em;}`,
  WhiteSpan = styled.span`color: white;`,
  NodeLinkText = ({ url, text }) => (
    <HoverLink href={url}><span>{text}</span></HoverLink>),
  LinkNode = ({ url, text }) => (
    <ListItem><NodeLinkText url={url} text={text} /></ListItem>),
  SubLinkNode = ({ url, text }) => (
    <SubListItem> <NodeLinkText url={url} text={text} /></SubListItem>),
  SubMenu = ({ childNodes, text: labelText }) => (
    <ListItem>
      <NodeLinkText text={labelText} />
      <WhiteSpan>{'▼'}</WhiteSpan>
      <SubList>
        {childNodes.map(({ url, text }) =>
          <SubLinkNode url={url} text={text} />)}
      </SubList>
    </ListItem>);

[NodeLinkText, LinkNode, SubLinkNode].forEach(({ propTypes }) => {
  if (!propTypes) propTypes = urlText;
})


SubMenu.propTypes = {
  childNodes: array,
  url: string,
  text: string
};

function DropdownMenu({ menuNodes }) {
  function renderNode(node) {
    var L = { true: SubMenu, false: LinkNode }[!!node.childNodes]
    return <L {...node} />;
  }

  return <ContainerDiv>
    <TopLevelList>{menuNodes.map(node => renderNode(node))}</TopLevelList>
  </ContainerDiv>;
}

DropdownMenu.propTypes = {
  menuNodes: array
};

export default DropdownMenu;
