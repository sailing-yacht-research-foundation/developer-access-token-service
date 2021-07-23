const express = require('express');
const path = require('path');
const buildPath = path.normalize(path.join(__dirname, '../public/build'));

module.exports = express.static(buildPath);
