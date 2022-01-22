const { extractParamsToJson, runCdk } = require("./helpers");

async function createBucket(action, settings) {
  const path = `${__dirname}/cdk-code`;

  // Take the params specified by kaholo plugin and keep them in a json file so that cdk can use them
  extractParamsToJson(action, path);

  // Run cdk related stuff
  runCdk(action, path);
}

module.exports = {
  createBucket,
};
