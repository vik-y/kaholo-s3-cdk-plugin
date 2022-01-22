rm ../s3-cdk.zip
mv params.json params1.json || true 
zip -r ../s3-cdk.zip . -x node_modules/**\*
xdg-open ../s3-cdk.zip