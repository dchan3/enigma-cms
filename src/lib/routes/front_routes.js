import { h } from 'preact'; /** @jsx h **/
import { FrontCategoryDisplay, FrontDocumentDisplay,
  FrontProfileDisplay, NotFound, SearchPage, Sitemap } from '../../client/views/front';

export default [
  {
    path: '/profile/:username',
    exact: true,
    component: FrontProfileDisplay
  },
  {
    path: '/:docType/:docNode',
    exact: true,
    component: FrontDocumentDisplay,
  },
  {
    path: '/not-found',
    exact: true,
    component: NotFound
  },
  {
    path: '/search',
    exact: true,
    component: SearchPage
  },
  {
    path: ['/sitemap.html', '/sitemap'],
    exact: true,
    component: Sitemap
  },
  {
    path: '/:docType',
    exact: true,
    component: FrontCategoryDisplay
  },
  {
    path: '/',
    exact: true,
    component: () => <div />
  }, {
    path: '*',
    exact: true,
    component: NotFound
  }];
