import React, { useEffect, useState } from 'react';
import { get as axget } from 'axios';
import { SamePageAnchor } from '../../reusables';

function SearchPage() {
  let [query, setQuery] = useState(''), [results, setResults] = useState({});

  useEffect(function() {
    axget(`/api/search/${query}`).then(({ data }) => setResults(
      typeof data === 'string' ? {} : data
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
