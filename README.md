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

  ```
  const mongoS3Backup = require('mongodb-dump-backup-aws-s3');
  const backupClient = mongoS3Backup({ bucketName: 'myBucketName', accessKey: 'myAccessKey', accessSecret: 'myAccessSecret' });

  backupClient.backupDatabase({ uri: 'mongodb://localhost/test-database', backupName: 'test_backup' })
  .then(response => {
   console.log('Success response ', response)
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
  .catch(err => {
    console.log(err)
  })
  ```
### Possible options passed to `backupDatabase` method
- `uri: string` `required` the connection string for the mongo database `
- `backupName: string` `required` the name of the backup to be dumped on s3
- `gzip: true|false` wheather to use gzip option for the dump command, defaults to false
#### The package supports both promises & callback patterns