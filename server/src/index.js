const app = require("./app");
const env = require("./config/env");
const { testConnection } = require("./config/database");

async function start() {
  await testConnection();

  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
    console.log(`Environment: ${env.NODE_ENV}`);
  });
}

start();
