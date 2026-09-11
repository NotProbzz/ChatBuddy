const { MongoMemoryServer } = require('mongodb-memory-server');
(async () => {
  const mongod = await MongoMemoryServer.create();
  console.log("URI:", mongod.getUri());
  await mongod.stop();
})();
