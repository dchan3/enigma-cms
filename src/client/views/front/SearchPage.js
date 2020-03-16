import { h } from 'preact'; /** @jsx h **/
import { useEffect, useState } from 'preact/hooks';
import { getRequest } from '../../utils/api_request_async';
import { SamePageAnchor } from '../../reusables/front_exports';
import { objMap } from '../../utils/lofuncs';

export default function SearchPage() {
  let [query, setQuery] = useState(''), [results, setResults] = useState({});

  useEffect(function() {
    getRequest(`search/${query}`, (data) => setResults(
      data.error ? {} : data
    ));
  }, [query])

  function handleChange(evt) {
    setQuery(evt.target.value);
  }

  return  [
    <input type="search" value={query} onChange={handleChange} />,
    Object.keys(results).length ? objMap(results,
      function(r) {
        var { typeInfo: { docTypeNamePlural, slugFrom },
          docInfo: { slug, content } } = this[r];
        return <div>
          <SamePageAnchor href={
            `/${docTypeNamePlural}/${slug}`}>{content[slugFrom]}</SamePageAnchor>
        </div>;
      }
    ) : <p>No results.</p>];
}
