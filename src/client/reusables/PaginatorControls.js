import { h, createElement } from 'preact'; /** @jsx h **/
import { useContext } from 'preact/hooks';
import fromCss from '../contexts/FromCssContext';
import PaginatorControlContext from './PaginatorControlContext';

export function generateArray() {
  let retval = [], n = arguments[0], k = arguments[1];

  for (let i = (k !== undefined ? n : 1), max = (k !== undefined ? k : n); i <= max; i++) {
    retval.push(i);
  }

  return retval;
}

export function truncatePageList(
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

  let quarter = Math.floor(half / 2), retval = [1, null].concat(
    generateArray(currentPage - quarter, currentPage + quarter))
    .concat(currentPage + quarter < numberOfPages ? [null, numberOfPages] : []);

  /* eslint-disable for-direction */
  for (let l = retval.length,
    a = retval[l - 2],
    b = retval[l - 1],
    r = retval[l];
    l-- <= 2;
    a = retval[l - 2],
    b = retval[l - 1],
    r = retval[l]) {
    if (a + 2 === r && b === null) {
      retval[l - 1] = r - 1;
    }
  }

  let q = 0;

  while (q < retval.length - 2) {
    if (retval[q] + 1 === retval[q + 2] && retval[q + 1] === null) {
      retval = retval.slice(0, q + 1).concat(retval.slice(q + 2,
        retval.length));
    }
    q++;
  }

  return retval;
}

const PaginatorContainer = fromCss('div',
    'clear:both;width:100%;margin:0px auto;'),
  PaginatorColoredButton = fromCss('li', ({ isActive }) =>
    'text-align:center;border:thin grey solid;padding:5px;width:35px;height:35px;display:inline-block;font-size:1.15em;color:white;' +
  `${isActive ? 'background-color:black;' : '' }`),
  PaginatorList = fromCss('ul', 'list-style:none;padding-left:0px;display:inline;'),
  PaginatorNumber = fromCss('a', 'color:inherit;font-size:inherit;');

export default function PaginatorControls() {
  let PaginatorButton = function({ onClick, children }) {
    return <PaginatorColoredButton className="themed" onClick={onClick}>{children}
    </PaginatorColoredButton>
  }

  let { state, dispatch } = useContext(PaginatorControlContext),
    { maxPages, maxPageTabs, currentPage, truncate, activeTabColor, pages,
      columns, className, updateDisplay } =
    state, truncated = truncate ?
      truncatePageList(maxPages ? maxPages : pages.length,
        maxPageTabs || 5, currentPage) : undefined;

  return <PaginatorContainer>
    <PaginatorList>
      {currentPage > 1 && <PaginatorButton onClick={() => {
        dispatch({ type: 'page', val: '-' }); updateDisplay(className, columns);
      }}>
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
      {currentPage < pages.length && <PaginatorButton onClick={() => {
        dispatch({ type: 'page', val: '+' });
        updateDisplay(className, columns);
      }}>
        <PaginatorNumber>{'>'}</PaginatorNumber>
      </PaginatorButton> || null}
    </PaginatorList>
  </PaginatorContainer>;
}
