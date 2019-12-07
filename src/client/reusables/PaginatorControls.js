import React, { useContext } from 'react';
import fromCss from '../utils/component_from_css';
import PaginatorControlContext from './PaginatorControlContext';

var generateArray = function() {
  let retval = [], n = arguments[0], k = arguments[1];

  for (let i = (k !== undefined ? n : 1); i <= (k !== undefined ? k : n); i++) {
    retval.push(i);
  }

  return retval;
};

function truncatePageList(
  numberOfPages, maxPageTabs, currentPage) {
  if (numberOfPages <= maxPageTabs) {
    return generateArray(numberOfPages);
  }

  let half = Math.floor(maxPageTabs / 2);

  if (currentPage === numberOfPages) {
    return generateArray(half).concat([null])
      .concat(generateArray(numberOfPages - half, numberOfPages));
  }

  if (currentPage <= half) {
    return generateArray(half * 2 - 1)
      .concat([null, numberOfPages - 1, numberOfPages]);
  }

  let quarter = Math.floor(half / 2);

  return [1, null].concat(
    generateArray(currentPage - quarter, currentPage + quarter))
    .concat(currentPage + quarter < numberOfPages ? [null, numberOfPages] : []);
}

const PaginatorContainer = fromCss(
    'div', 'clear:both;width:100%;margin:0px auto;'),
  PaginatorButton = fromCss('li', ({ isActive, activeTabColor }) =>
    ('text-align:center;border:thin grey solid;padding:5px;width:35px;' +
  'height:35px;display:inline-block;font-size:1.15em;' +
  `${isActive ? `background-color:${activeTabColor};color: white;` : ''}`), [
    'isActive', 'activeTabColor'
  ]), PaginatorList = fromCss('ul',
    'list-style:none;padding-left:0px;display:inline;', [
      'isActive', 'activeTabColor']),
  PaginatorNumber = fromCss('a', 'color:inherit;font-size:inherit;', [
    'isActive', 'activeTabColor']);
export default function PaginatorControls() {
  let { state, dispatch } = useContext(PaginatorControlContext),
    { maxPages, maxPageTabs, currentPage, truncate, activeTabColor, pages } =
    state, truncated = truncate ?
      truncatePageList(maxPages ? maxPages : pages.length,
        maxPageTabs || 5, currentPage) : undefined;

  return <PaginatorContainer>
    <PaginatorList>
      {currentPage > 1 && <PaginatorButton onClick={() =>
        dispatch({ type: 'page', val: '-' })}>
        <PaginatorNumber>{'<'}</PaginatorNumber>
      </PaginatorButton> || null}
      {truncated ? (truncated.map(n => <PaginatorButton {...{ activeTabColor }}
        onClick={(n !== null && !!n) ? () => dispatch({ type: 'page', val: n })
          : null} isActive={(n !== null && currentPage === n)}>
        <PaginatorNumber>{(n !== null && !!n) ? n : '⋯'}</PaginatorNumber>
      </PaginatorButton>)) : generateArray(pages.length).map(i => (
        <PaginatorButton {...{ activeTabColor }}
          onClick={() => dispatch({ type: 'page', val: i + 1 })}
          isActive={currentPage === i + 1}>
          <PaginatorNumber>{i + 1}</PaginatorNumber>
        </PaginatorButton>))}
      {currentPage < pages.length && <PaginatorButton onClick={() => dispatch({
        type: 'page', val: '+' })}>
        <PaginatorNumber>{'>'}</PaginatorNumber>
      </PaginatorButton> || null}
    </PaginatorList>
  </PaginatorContainer>;
}
