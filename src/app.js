const { cloneCode, extractParamsToJson, runCdk } = require("./helpers");

async function createBucket(action, settings){
	const bucketName = action.params.bucketName
	const path = `/tmp/s3-cdk/${action.params.bucketName}`

	extractParamsToJson(action, path)
	runCdk(action, path)
}

module.exports = {
	createBucket,
};