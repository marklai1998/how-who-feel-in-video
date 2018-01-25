const AWS = require('aws-sdk');

exports.upload = async (bucket, key, file) => {
    console.log(file.data);
    let s3 = new AWS.S3();
    let params = {Bucket: bucket, Key: key, Body: file.data};
    try {
        await s3.putObject(params, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
        });
    } catch (err) {
        return err
    }
};