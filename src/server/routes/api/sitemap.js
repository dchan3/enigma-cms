import { Router } from 'express';
import { default as sitemapFetchFuncs } from '../fetch_funcs/sitemap';

var router = Router();

router.get('/render', async function(req, res) {
  return res.status(200).json(await sitemapFetchFuncs.renderSitemap());
});

export default router;
