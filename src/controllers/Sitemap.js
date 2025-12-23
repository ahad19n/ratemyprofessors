const express = require("express");
const router = express.Router();

const { Readable } = require('stream');
const { SitemapStream, streamToPromise } = require('sitemap');

const Professor = require("../models/Professor");

router.get("/", async (req, res) => {
  try {
    const professors = await Professor.find({}, 'slug').lean();

    const links = [
      ...professors.map(p => ({url: `/professor/${p.slug}`, changefreq: 'weekly', priority: 1.0 }))
    ];

    res.header('Content-Type', 'application/xml');
    res.send(await streamToPromise(Readable.from(links).pipe(
        new SitemapStream({ hostname: `https://${req.get('host')}` })
    )).then(data => data.toString()));
  }
  
  catch (err) {
    console.error(err);
    res.status(500).render('errors/500');
  }
});

module.exports = router;
