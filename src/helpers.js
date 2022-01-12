const child_process = require("child_process");
const fs = require("fs");
/**
 *
 * @param {String} cmd Command to run
 * @param {String} path Working directory inside which to run the command. We try to create this directory if it doesn't exist
 */
function runCommand(cmd, path, env = {}, stdio = "pipe") {
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

function cloneCode(repo_url, base_path) {
  // clone code or download tar
  const cmd = `git clone ${repo_url}`;
  runCommand(cmd, base_path);
}

function runCdk(action, path) {
  // Install pre-req utilities
  // This is to download cdk code. Will probably host it somewhere else and use wget
  const gdriveFileId = "1162BH9j8EVq2Ylse7xQKdWBgAul1h3fL";
  runCommand(
    "apt update && apt install -y python-pip && pip install gdown",
    path
  );

  const env = {
    ...process.env,
    AWS_ACCESS_KEY_ID: action.params.ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: action.params.ACCESS_KEY_SECRET,
  };

  // Donwload and extract cdk code
  runCommand(
    `gdown --id ${gdriveFileId} && unzip -o s3-cdk.zip`,
    path,
    (stdio = "ignore")
  );
  // npm install

  runCommand(`cat params.json`, path);

  const stackName = `${action.params.BUCKET_NAME}-stack`;
  //runCommand
  runCommand(`ln -sf /usr/local/bin/nodejs /usr/bin/node`, path);
  runCommand(`rm package-lock.json && rm -rf node_modules`, path);
  runCommand(`npm install cdk`, path);
  //runCommand(`npm install`, path);

  const out = child_process.spawnSync("npm", ["install"], {
    cwd: path,
    stdio: "pipe",
    encoding: "utf-8",
  });

  // console.log(out);

  // const temp = child_process.spawnSync("env", {
  //   cwd: path,
  //   env: env,
  //   stdio: "pipe",
  // });

  // console.log(temp);

  // child_process.spawnSync("env", {
  //   cwd: path,
  //   env: env,
  //   stdio: "pipe",
  // });

  const temp = child_process.spawnSync("/usr/local/bin/cdk", ["bootstrap"], {
    cwd: path,
    stdio: "pipe",
    encoding: "utf-8",
    env: env,
  });

  console.log(temp);

  const child = child_process.spawnSync(
    "/usr/local/bin/cdk",
    ["deploy", "--require-approval", "never"],
    {
      cwd: path,
      stdio: "pipe",
      encoding: "utf-8",
      env: env,
    }
  );

  console.log(child);

  // create env

  // cdk bootstrap
  // cdk deploy
}

/**
 *
 * @param {*} action Action passed by the kaholo pipeline
 */
function extractParamsToJson(action, path) {
  const params = JSON.stringify(action.params);
  const filename = `${path}/params.json`;
  fs.writeFileSync(filename, params);
}

module.exports = {
  cloneCode,
  extractParamsToJson,
  runCdk,
  initDir,
};
