require('dotenv').config();

const httpServer = require('./servers/http');

const PORT = parseInt(process.env.PORT) || 5000;

(() => {
  try {
    // await startDB();
    const server = httpServer.listen(PORT, () =>
      console.log(`listening on ${PORT}`),
    );
  } catch (err) {
    console.log('start failed');
    console.error(err);
  }
})();
