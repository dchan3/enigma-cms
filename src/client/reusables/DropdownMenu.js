import React from 'react';
import { array, string, object } from 'prop-types';
import styled from 'styled-components';
import SamePageAnchor from './SamePageAnchor';

let urlText = { url: string, text: string, history: object }, ContainerDiv =
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
  NodeLinkText = ({ url, text, history }) => (
    <SamePageAnchor component={HoverLink} {...{ history }} href={url}>
      <span>{text}</span></SamePageAnchor>),
  LinkNode = ({ url, text, history }) => (
    <ListItem><NodeLinkText {...{ url, text, history }} /></ListItem>),
  SubLinkNode = ({ url, text, history }) => (
    <SubListItem><NodeLinkText {...{ url, text, history }} /></SubListItem>),
  SubMenu = ({ childNodes, text: labelText, history }) => (
    <ListItem>
      <NodeLinkText text={labelText} />
      <WhiteSpan>{'▼'}</WhiteSpan>
      <SubList>
        {childNodes.map(({ url, text }) =>
          <SubLinkNode {...{ url, text, history }} />)}
      </SubList>
    </ListItem>);

[NodeLinkText, LinkNode, SubLinkNode].forEach(({ propTypes }) => {
  if (!propTypes) propTypes = urlText;
});

SubMenu.propTypes = {
  childNodes: array,
  text: string,
  history: object
};

function DropdownMenu({ menuNodes, history }) {
  function renderNode(node) {
    let L = !!node.childNodes ? SubMenu : LinkNode;
    return <L {...node} {...{ history }} />;
  }

  return <ContainerDiv>
    <TopLevelList>{menuNodes.map(node => renderNode(node))}</TopLevelList>
  </ContainerDiv>;
}

DropdownMenu.propTypes = {
  menuNodes: array
};

export default DropdownMenu;
