import { h, createElement } from 'preact'; /** @jsx h **/
import SamePageAnchor from './SamePageAnchor';
import fromCss from '../contexts/FromCssContext';

let ContainerDiv = fromCss('div',
    'width:10%;margin:0;text-align:center;vertical-align:top;display:inline-block;overflow-y:scroll;height:100vh;'),
  TopLevelList = fromCss('ul',
    'list-style-type:none;text-transform:uppercase;padding-left:0;font-family:sans-serif;display:block;'),
  ListItem = fromCss('li', 'padding:8px;'), SubList = fromCss('ul',
    'list-style-type:none;text-transform:uppercase;padding-left:0;font-family:sans-serif;'),
  SubListItem = fromCss('li', 'padding:8px 8px 0 8px;'), HoverLink = fromCss('a',
    'color:white;text-decoration:none;'), WhiteSpan = fromCss('span',
    'color:white;'), NodeLinkText = ({ url, text }) => <SamePageAnchor
    component={HoverLink} href={url}><span>{text}</span></SamePageAnchor>,
  LinkNode = ({ url, text }) => <ListItem><NodeLinkText {...{ url, text }} />
  </ListItem>, SubLinkNode = ({ url, text }) => <SubListItem>
    <NodeLinkText {...{ url, text }} /></SubListItem>, SubMenu = ({ childNodes,
    text: labelText }) => <ListItem>
    <NodeLinkText text={labelText} />
    <WhiteSpan>{'▼'}</WhiteSpan>
    <SubList>
      {childNodes.map(({ url, text }) => <SubLinkNode {...{ url, text }} />)}
    </SubList>
  </ListItem>;

function renderNode(node) {
  let L = node.childNodes ? SubMenu : LinkNode;
  return <L {...node} />;
}

export default function DropdownMenu({ menuNodes }) {
  return <ContainerDiv>
    <TopLevelList className="themed">{menuNodes.map(node => renderNode(node))}</TopLevelList>
  </ContainerDiv>;
}
