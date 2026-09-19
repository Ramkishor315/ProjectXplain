const app = require('./app');

const port = Number(process.env.PORT) || 4000;
require('./db/connection');

app.listen(port, () => {
  console.log(`ProjectXplain backend listening on http://localhost:${port}`);
});