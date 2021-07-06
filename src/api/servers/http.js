const express = require('express');
const helmet = require('helmet');

const versionRouter = require('../routes/versionRouter');
const errorHandler = require('../middlewares/errorHandler');

const app = express();

app.use(helmet());
app.use(express.json());

app.use(versionRouter);

app.use(errorHandler);

module.exports = app;
