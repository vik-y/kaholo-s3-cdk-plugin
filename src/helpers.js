const child_process = require("child_process");
const fs = require("fs");
/**
 *
 * @param {String} cmd Command to run
 * @param {String} path Working directory inside which to run the command. We try to create this directory if it doesn't exist
 */

function runCommandSpawn(exe, params, path, env = {}) {
  /**
   * Uses spawnSync to run commands
   */

  child_process.spawnSync("npm", ["install"], {
    cwd: path,
    stdio: "inherit",
    encoding: "utf-8",
  });
  const result = child_process.spawnSync(exe, params, {
    cwd: path,
    stdio: "inherit",
    encoding: "utf-8",
    env: env,
    shell: "bash",
  });

  if (result.status != 0) {
    throw new Error(
      `Failed to run command ${exe} ${params} with exit status ${result.status}`
    );
  }
}

function runCommand(cmd, path, env = {}, stdio = "inherit") {
  /**
   * Uses execSync to run the commands
   */
  if (!path) {
    throw "Path was not provided!";
  }

  const exec_result = child_process.execSync(cmd, {
    cwd: path,
    env: env,
    stdio: stdio,
  });
  if (exec_result) {
    console.log(exec_result.toString());
  }
}

function initDir(path) {
  runCommand(`mkdir -p ${path}`, "/tmp");
}

function runCdk(action, path) {
  // Set env for the process to use
  const env = {
    ...process.env,
    AWS_ACCESS_KEY_ID: action.params.ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: action.params.ACCESS_KEY_SECRET,
    NPM_CONFIG_UNSAFE_PERM: true,
  };

  const stackName = `${action.params.BUCKET_NAME}-stack`;

  runCommandSpawn("/usr/local/bin/npm", ["install", "-g", "cdk"], path);
  runCommandSpawn(
    "/usr/local/bin/npm",
    ["--scripts-prepend-node-path=true", "install"],
    path,
    env
  );
  runCommandSpawn("/usr/local/bin/cdk", ["bootstrap"], path, env);
  runCommandSpawn(
    "/usr/local/bin/cdk",
    ["deploy", "--require-approval", "never"],
    path,
    env
  );
}

/**
 *
 * @param {*} action Action passed by the kaholo pipeline
 */
function extractParamsToJson(action, path) {
  // Making a copy of the params
  const params = JSON.parse(JSON.stringify(action.params));

  // and deleting sensitive data from it before writing params to file
  delete params["ACCESS_KEY_ID"];
  delete params["ACCESS_KEY_SECRET"];

  const paramsData = JSON.stringify(params);
  const filename = `${path}/params.json`;
  fs.writeFileSync(filename, paramsData);
}

module.exports = {
  extractParamsToJson,
  runCdk,
  initDir,
};
