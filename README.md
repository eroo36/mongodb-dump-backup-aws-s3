# Mongo Dump S3

### What can it do ?

A utility to backup/dump mongo database to amazon s3

### How do I get set up?

- Install the package
  `npm install mongodb-dump-backup-aws-s3`
- Import it into your file
- Setup a backup client with your aws credential
- Initiate the backup

### Notes about the generated dump

#### The generated mongo dump is an archive, so while restoring you should mark the --archive flag on

`mongorestore --archive=/path/to/dump`

### Working example:

```js
const mongoS3Backup = require("node-mongodump-s3");
const dotenv = require("dotenv");
const moment = require("moment");
dotenv.config(".env");

const bucketName = process.env.AWS_S3_DUMP_BUCKET;
const accessKey = process.env.AWS_ACCESS_KEY_ID;
const accessSecret = process.env.AWS_SECRET_ACCESS_KEY;
const dbConnectionUri = process.env.MONGO_URI;

const backupClient = mongoS3Backup({ bucketName, accessKey, accessSecret });
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
```

### Possible options passed to `backupDatabase` method

- `uri: string` `required` the connection string for the mongo database `
- `backupName: string` `required` the name of the backup to be dumped on s3
- `gzip: true|false` wheather to use gzip option for the dump command, defaults to false

#### The package supports both promises & callback patterns
