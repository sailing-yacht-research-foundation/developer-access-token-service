const express = require('express');
const router = express.Router();
const path = require('path');
const buildPath = path.normalize(path.join(__dirname, '../public/build'));

router.get('(/*)?', async (req, res, next) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

module.exports = { staticFile: express.static(buildPath), router };
