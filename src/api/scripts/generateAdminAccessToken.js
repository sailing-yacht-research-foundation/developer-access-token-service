const jwt = require('jsonwebtoken');
require('dotenv').config();

(async () => {
  const name = process.argv
    .find((t) => t.startsWith('--name'))
    ?.split('=')
    .pop();
  const email = process.argv
    .find((t) => t.startsWith('--email'))
    ?.split('=')
    .pop();

  if (!name || !email) {
    console.log('missing argument name or email');
    return;
  }

  const token = await jwt.sign({ email, name }, process.env.JWT_SECRET);
  console.log(token);
})();
