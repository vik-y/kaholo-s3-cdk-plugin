const { cloneCode, extractParamsToJson, runCdk, initDir } = require("./helpers");

async function createBucket(action, settings){
	const bucketName = action.params.BUCKET_NAME
	const path = `/tmp/s3-cdk/${bucketName}`
	initDir(path)
	extractParamsToJson(action, path)
	runCdk(action, path)
}

module.exports = {
	createBucket,
};