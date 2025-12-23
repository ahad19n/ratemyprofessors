const express = require("express");
const router = express.Router();

const { Readable } = require('stream');
const { SitemapStream, streamToPromise } = require('sitemap');

const Professor = require("../models/Professor");

router.get("/", async (req, res) => {
  try {
    const professors = await Professor.find({}, 'slug').lean();

    const links = [
      { url: '/', changefreq: 'weekly', priority: 1.0 },
      { url: '/auth', changefreq: 'weekly', priority: 1.0 },
      { url: '/about', changefreq: 'weekly', priority: 1.0 },
      { url: '/contact', changefreq: 'weekly', priority: 1.0 },
      ...professors.map(p => ({url: `/professor/${p.slug}`, changefreq: 'weekly', priority: 1.0 }))
    ];

    const sitemap = new SitemapStream({ hostname: `${req.protocol}://${req.get('host')}` });
    const xml = await streamToPromise(Readable.from(links).pipe(sitemap)).then(data => data.toString());

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  }
  
  catch (err) {
    console.error(err);
    res.status(500).render('errors/500');
  }
});

module.exports = router;
