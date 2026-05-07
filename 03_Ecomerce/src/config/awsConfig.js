const { S3Client } = require('@aws-sdk/client-s3');
const { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY } = require('./serverConfig');


// Create S3 client with AWS SDK v3
const s3client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  }
});


module.exports = {s3client};