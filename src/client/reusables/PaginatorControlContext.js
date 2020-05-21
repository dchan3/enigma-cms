import { h, createContext } from 'preact'; /** @jsx h **/
import renderToString from 'preact-render-to-string';
import { useReducer } from 'preact/hooks';

export const strQuery = (str, query) => query.split(' ').reduce(
  (acc, cur) => acc && !!str.match(new RegExp(cur, 'i')), true);

export function shallowSearch(items, query) {
  var retval = [];
  if (query === '') return items;
  items.forEach(item => {
    if (typeof item !== 'object') {
      if (strQuery(item.toString(), query)) {
        retval.push(item);
      }
    }
    if (typeof item === 'object') {
      for (var k in item) {
        if (strQuery(item[k].toString(), query)) {
          retval.push(item);
          break;
        }
      }
    }
  });
  return retval;
}

export function pages(items, per, maxPages) {
  let retval = [], page = 0, counter = 0;
  for (let i = 0; i < items.length; i++) {
    if (maxPages) {
      if (page >= maxPages) {
        break;
      }
    }
    if (counter === 0) {
      retval.push([]);
    }
    retval[page].push(items[i]);
    counter++;
    if (counter === per) {
      counter = 0;
      page++;
    }
  }
  return retval;
}

var initialState = ({
  items, useListElement, activeTabColor, truncate, maxPageTabs,
  maxPages, perPage, wrapper, enumerate, currentPage, currentColumn, columns
}) => {
  let themPages = pages(items, perPage || 10, maxPages || null);
  return {
    currentPage: currentPage || 1,
    currentColumn: currentColumn || 0,
    ascDesc: true,
    searchQuery: '',
    items,
    currentResults: items,
    maxPages: maxPages || null,
    perPage: perPage || 10,
    pages: themPages,
    thePage: themPages.length ? themPages[(currentPage || 1) - 1] : [],
    maxPageTabs: maxPageTabs || 5,
    truncate,
    activeTabColor: activeTabColor || '#5940be',
    useListElement: useListElement || false,
    wrapper: wrapper || null,
    enumerate: enumerate || false,
    columns: columns || null
  };
};

const PaginatorControlContext = createContext(initialState);

function reducer(state, { type, val }) {
  let newState = Object.assign({}, state);
  if (type === 'page') {
    if (val === '-') newState.currentPage--;
    else if (val === '+') newState.currentPage++;
    else newState.currentPage = val;
  }
  else if (type === 'column') {
    newState.currentColumn = val;
    newState.ascDesc = true;
    newState.currentResults.sort((a, b) => {
      let dispA = newState.columns[newState.currentColumn].display(a),
        dispB = newState.columns[newState.currentColumn].display(b);
      return (dispA.props ? renderToString(dispA) : dispA.toString())
        .localeCompare((dispB.props ? renderToString(dispB) : dispB.toString())
        ) * (newState.ascDesc ? 1 : -1);
    });
    newState.pages = pages(newState.currentResults, newState.perPage,
      newState.maxPages);
  }
  else if (type === 'toggle') {
    newState.ascDesc = !newState.ascDesc;
    newState.currentResults.sort((a, b) => {
      let dispA = newState.columns[newState.currentColumn].display(a),
        dispB = newState.columns[newState.currentColumn].display(b);
      return (dispA.props ? renderToString(dispA) : dispA.toString())
        .localeCompare((dispB.props ? renderToString(dispB) : dispB.toString())
        ) * (newState.ascDesc ? 1 : -1);
    });
    newState.pages = pages(newState.currentResults,
      newState.perPage, newState.maxPages);
  }
  else if (type === 'query') {
    if (val.startsWith(newState.searchQuery) && newState.searchQuery.length) {
      let results = shallowSearch(newState.currentResults, val);
      if (results.length < newState.currentResults.length) {
        newState.currentResults = results;
      }
    }
    else {
      newState.currentResults = shallowSearch(newState.items, val);
    }

    newState.pages = pages(newState.currentResults, newState.perPage,
      newState.maxPages);
    newState.searchQuery = val;
    newState.currentPage = 1;
  }
  else if (type === 'items') {
    newState.items = val;
    newState.currentResults = val;
    newState.pages = pages(val, newState.perPage, newState.maxPages);
    newState.currentPage = 1;
  }
  else if (type === 'objectInit') {
    for (let p in val) {
      newState[p] = val[p];
    }
  }
  else {
    newState[type] = val;
    if (type === 'perPage' || type === 'maxPages') {
      newState.searchQuery = '';
      newState.currentResults = newState.items;
      newState.pages = pages(val, newState.perPage, newState.maxPages);
      newState.currentPage = 1;
    }
  }

  if (newState.pages.length) {
    if (newState.currentPage > newState.pages.length) newState.currentPage = 1;
    newState.thePage = newState.pages[newState.currentPage - 1];
  }
  else newState.thePage = [];
  return newState;
}

const { Provider } = PaginatorControlContext;

export const PaginatorControlProvider = ({ children, initialVals }) => {
  let iState = Object.assign({}, initialState(initialVals));

  if (initialVals) {
    for (let k in initialVals) {
      iState[k] = initialVals[k];
    }
  }

  iState.pages = pages(iState.items, iState.perPage, iState.maxPages);
  if (iState.pages.length) iState.thePage = iState.pages[0];

  let [state, dispatch] = useReducer(reducer, iState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export default PaginatorControlContext;
