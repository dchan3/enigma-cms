import React from 'react';
import styled from 'styled-components';
import SamePageAnchor from './SamePageAnchor';

let ContainerDiv =
  styled.div`width:fit-content;margin:auto;text-align:center;`, TopLevelList =
  styled.ul`list-style-type:none;text-transform:uppercase;padding-left:0;
font-family:sans-serif;@media(min-width:767px){display:inline-flex;}
background-color:cadetblue;`, ListItem = styled.li`padding:8px;`, SubList =
  styled.ul`list-style-type:none;text-transform:uppercase;padding-left:0;
font-family:sans-serif;`, SubListItem = styled.li`padding:8px 8px 0 8px;`,
  HoverLink = styled.a`color:white;text-decoration:none;
  -webkit-transition:font-size .25s;
  -moz-transition:font-size .25s;
  -o-transition:font-size .25s;
  transition:font-size .25s;
  &:hover{text-decoration:underline;font-size:1.2em;}`,
  WhiteSpan = styled.span`color:white;`,
  NodeLinkText = ({ url, text }) => (
    <SamePageAnchor component={HoverLink} href={url}>
      <span>{text}</span></SamePageAnchor>),
  LinkNode = ({ url, text }) => (
    <ListItem><NodeLinkText {...{ url, text }} /></ListItem>),
  SubLinkNode = ({ url, text }) => (
    <SubListItem><NodeLinkText {...{ url, text }} /></SubListItem>),
  SubMenu = ({ childNodes, text: labelText }) => (
    <ListItem>
      <NodeLinkText text={labelText} />
      <WhiteSpan>{'▼'}</WhiteSpan>
      <SubList>
        {childNodes.map(({ url, text }) =>
          <SubLinkNode {...{ url, text }} />)}
      </SubList>
    </ListItem>);

function DropdownMenu({ menuNodes }) {
  function renderNode(node) {
    let L = !!node.childNodes ? SubMenu : LinkNode;
    return <L {...node} />;
  }

  return <ContainerDiv>
    <TopLevelList>{menuNodes.map(node => renderNode(node))}</TopLevelList>
  </ContainerDiv>;
}


export default DropdownMenu;
