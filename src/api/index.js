require('dotenv').config();

const { startDB } = require('./models');
const httpServer = require('./servers/http');

const PORT = parseInt(process.env.PORT) || 5000;

(async () => {
  try {
    await startDB();
    httpServer.listen(PORT, () => console.log(`listening on ${PORT}`));
  } catch (err) {
    console.log('start failed');
    console.error(err);
  }
})();
