const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const aws = require("aws-sdk");

module.exports = function ({ bucketName, accessKey, accessSecret }) {
  const s3Bucket = new aws.S3({
    accessKeyId: accessKey,
    secretAccessKey: accessSecret,
    Bucket: bucketName,
  });

  function dumpDatabase(
    { uri, backupName, gzip },
    callback = (err, backupPath) => {}
  ) {
    const dumpPath = path.resolve(__dirname, backupName);
    const command = `mongodump --uri="${uri}" ${
      gzip ? " --gzip" : ""
    } --archive="${dumpPath}"`;
    exec(command, (err, stdout, stderr) => {
      // We cannot trust stderr cause mongo spits warnings/logs on this channel
      // so we check if the dump was created
      if (err) {
        return callback(err);
      }
      if (!fs.existsSync(dumpPath)) {
        return callback(new Error("Something went wrong"));
      }
      return callback(null, dumpPath);
    });
  }

  function uploadToS3(file, fileName, prefix, callback = (err, data) => {}) {
    s3Bucket.upload(
      {
        Bucket: bucketName,
        Key: `${prefix || ""}${fileName}`,
        Body: file,
      },
      (err, data) => {
        if (err) {
          return callback(err);
        }
        return callback(null, data);
      }
    );
  }

  return {
    backupDatabase({ uri, backupName, prefix, gzip }, callback = () => {}) {
      return new Promise((resolve, reject) => {
        if (!uri || !backupName) {
          throw new Error("uri and backupName are required parameters");
        }
        dumpDatabase({ uri, backupName, gzip }, (err, backupPath) => {
          if (err) {
            callback(err);
            return reject(err);
          }
          uploadToS3(
            fs.createReadStream(backupPath),
            backupName,
            prefix,
            (err, data) => {
              if (err) {
                callback(err);
                return reject(err);
              }
              fs.unlink(backupPath, () => {});
              callback(null, data);
              return resolve(data);
            }
          );
        });
      });
    },
  };
};
