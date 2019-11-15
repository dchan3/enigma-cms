import React, { useContext } from 'react';
import PaginatorControls from './PaginatorControls';
import PaginatorControlContext, {
  PaginatorControlProvider } from './PaginatorControlContext';
import fromCss from '../utils/component_from_css';

let TableHeaderCell = fromCss('td', '');

function TablePaginatorSearchBar() {
  let { state: { searchQuery }, dispatch } =
    useContext(PaginatorControlContext);

  function handleSearchChange(event) {
    dispatch({ type: 'query', val: event.target.value });
  }

  return <input type="text" placeholder="Search" value={searchQuery}
    onChange={handleSearchChange}/>
}

function TablePaginatorDisplay() {
  let { state, dispatch } = useContext(PaginatorControlContext);
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
    return <thead><tr>
      {enumerate ? <td><b>{'#'}</b></td> : null}
      {columns.map(({ headerText }, i) => <TableHeaderCell
        onClick={() => handleHeaderClick(i)}>
        <b>{headerText}</b>
        {' '}
        {currentColumn === i ? <span>{ascDesc ? '▲' : '▼'}</span> : null}
      </TableHeaderCell>)}
    </tr></thead>;
  }

  function renderPage() {
    return <tbody>
      {thePage.map((item, i) => <tr key={i}>
        {enumerate ? <td>{i}</td> : null}
        {columns.map(({ display }, j) => <td key={j}>{display(item)}</td>)}
      </tr>)}
    </tbody>;
  }

  return <table key='table-paginator' {...{ className, id }}>
    {renderHeader()}
    {renderPage()}
  </table>;
}

function TablePaginatorDiv() {
  return <div>
    <TablePaginatorDisplay />
    <PaginatorControls />
  </div>;
}

function TablePaginatorTop() {
  return <div>
    <TablePaginatorSearchBar />
    <TablePaginatorDiv />
  </div>
}

TablePaginatorTop.defaultProps = {
  activeTabColor: '#5940be',
  truncate: false,
  maxPageTabs: 5,
  maxPages: null,
  enumerate: false,
  className: null,
  id: null
};

export default function TablePaginator(props) {
  return <PaginatorControlProvider initialVals={{ ...props }}>
    <TablePaginatorTop />
  </PaginatorControlProvider>
}
