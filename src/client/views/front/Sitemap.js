import { h } from 'preact'; /** @jsx h **/
import useFrontContext from '../../hooks/useFrontContext';
import { Fedora, SamePageAnchor } from '../../reusables/front_exports';

export default function Sitemap() {
  let { state: { dataObj } } = useFrontContext({
    dataParams: [],
    urlParams: [],
    apiUrl: function() {
      return 'sitemap/render';
    }
  });

  if (dataObj) {
    return [<Fedora title="Sitemap" />,
      Object.keys(dataObj).map((docTypeId) => <ul>
        <li><SamePageAnchor href={`/${dataObj[docTypeId].docTypeNamePlural}`}>
          {dataObj[docTypeId].docTypeNamePlural}
        </SamePageAnchor>
        <ul>
          {dataObj[docTypeId].docs.map(([slug, title]) => <li>
            <SamePageAnchor href={`/${dataObj[docTypeId].docTypeNamePlural}/${slug}`}>
              {title}
            </SamePageAnchor></li>)}
        </ul>
        </li>
      </ul>)
    ];
  }
  else return null;
}
