import { h } from 'preact'; /** @jsx h **/
import { useContext, useEffect } from 'preact/hooks';
import PaginatorControls from './PaginatorControls';
import PaginatorControlContext, {
  PaginatorControlProvider } from './PaginatorControlContext';
import fromCss from '../contexts/FromCssContext';

let TableHeaderCell = fromCss('td', 'vertical-align:top;'),
  TableCell = fromCss('td', 'vertical-align:top;'),
  TableThiccBody = fromCss('tbody',
    'max-height:50vh;display:block;overflow:scroll;'),
  TableBigHead = fromCss('thead', 'display:block;');

function TablePaginatorSearchBar() {
  let { state: { searchQuery, className, columns }, dispatch, updateDisplay } =
    useContext(PaginatorControlContext);

  useEffect(function() {
    updateDisplay(className, columns);
  }, [searchQuery])

  function handleSearchChange(event) {
    dispatch({ type: 'query', val: event.target.value });
  }

  return <input type="text" placeholder="Search" value={searchQuery}
    onChange={handleSearchChange} onInput={handleSearchChange}/>;
}

function TablePaginatorDisplay() {
  let { state, dispatch, updateDisplay } = useContext(PaginatorControlContext);
  let {
    enumerate, thePage, columns, className, id, ascDesc,
    currentColumn } = state;

  function handleHeaderClick(i) {
    if (currentColumn === i) {
      return dispatch({ type: 'toggle' });
    }
    else return dispatch({ type: 'column', val: i });
  }

  function renderHeader() {
    return <TableBigHead><tr>
      {enumerate ? <TableCell><b>{'#'}</b></TableCell> : null}
      {columns.map(({ headerText }, i) => <TableHeaderCell
        onClick={() => {
          handleHeaderClick(i);
          updateDisplay(className, columns);
        } }>
        <b>{headerText}</b>
        {' '}
        {currentColumn === i ? <span>{ascDesc ? '▲' : '▼'}</span> : null}
      </TableHeaderCell>)}
    </tr></TableBigHead>;
  }

  function renderPage() {
    return <TableThiccBody>
      {thePage.map((item, i) => <tr key={i}>
        {enumerate ? <TableCell>{i}</TableCell> : null}
        {columns.map(({ display }, j) => <TableCell key={j}>{display(item)}</TableCell>)}
      </tr>)}
    </TableThiccBody>;
  }

  return <table {...{ className, id }}>
    {renderHeader()}
    {renderPage()}
  </table>;
}

function TablePaginatorDiv() {
  return <div>
    <style id="table-pag" />
    <TablePaginatorDisplay />
    <PaginatorControls />
  </div>;
}

function TablePaginatorTop() {
  return <div>
    <TablePaginatorSearchBar />
    <TablePaginatorDiv />
  </div>;
}

export default function TablePaginator(props) {
  return <PaginatorControlProvider initialVals={{ ...props }}>
    <TablePaginatorTop />
  </PaginatorControlProvider>;
}
