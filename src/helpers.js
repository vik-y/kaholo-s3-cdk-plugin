const child_process = require("child_process")
const fs = require('fs')
/**
 * 
 * @param {String} cmd Command to run
 * @param {String} path Working directory inside which to run the command. We try to create this directory if it doesn't exist
 */
function runCommand(cmd, path){
	if (!path){
        throw "Path was not provided!";
    }	

	// Create directory if it doesn't exist
	child_process.execSync(`mkdir ${path}`)
	const exec_result = child_process.execSync(cmd, {cwd: path})
	console.log(exec_result.toString())
}

function cloneCode(repo_url, base_path){
	const cmd = `git clone ${repo_url}`
	runCommand(cmd, base_path)
}

function runCdk(action, path){
	// clone cdk code 
	// npm install 
	// cdk bootstrap 
	// cdk deploy 
}
/**
 * 
 * @param {*} action Action passed by the kaholo pipeline
 */
function extractParamsToJson(action, path){
	const params = JSON.stringify(action.params)
	const filename = `${path}/params.json`
	fs.writeFileSync(filename, params)
}


module.exports = {
	cloneCode,
	extractParamsToJson, 
	runCdk
};