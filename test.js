const mognoS3Backup = require("./index");
const dotenv = require("dotenv");
const moment = require("moment");
dotenv.config(".env");

const bucketName = process.env.AWS_S3_DUMP_BUCKET;
const accessKey = process.env.AWS_ACCESS_KEY_ID;
const accessSecret = process.env.AWS_SECRET_ACCESS_KEY;
const dbConnectionUri = process.env.MONGO_URI;

const backupClient = mognoS3Backup({ bucketName, accessKey, accessSecret });
const date = moment().format("MMMM Do HH-mm");

backupClient
  .backupDatabase({ uri: dbConnectionUri, backupName: "test_backup_" + date })
  .then((response) => {
    console.log("Success response ", response);
    /*
    Success response includes default aws response to uploading files
    example: 
      { 
        ETag: '"exampleEtag"',
        Location: 'https://examplebucket.s3.amazonaws.com/test_backup',
        key: 'test_backup',
        Key: 'test_backup',
        Bucket: 'mybucket' 
      }

  */
  })
  .catch((err) => {
    console.log("error is ", err);
  });
