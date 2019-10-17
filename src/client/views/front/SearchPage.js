import React, { useEffect, useState } from 'react';
import { default as requests } from '../../utils/api_request_async';
import { SamePageAnchor } from '../../reusables';

function SearchPage() {
  let [query, setQuery] = useState(''), [results, setResults] = useState({});

  useEffect(function() {
    requests.getRequest(`search/${query}`, (data) => setResults(
      data.error ? {} : data
    ));
  }, [query])

  function handleChange(evt) {
    setQuery(evt.target.value)
  }

  return <div>
    <input type="search" value={query} onChange={handleChange} />
    {Object.keys(results).length ? Object.keys(results).map(
      r => <div>
        <SamePageAnchor href={
          `/${results[r].typeInfo.docTypeNamePlural}/${
            results[r].docInfo.slug}`}>
          {results[r].docInfo.content[
            results[r].typeInfo.slugFrom]}</SamePageAnchor>
      </div>
    ) : <p>No results.</p>}
  </div>;
}

export default SearchPage;
