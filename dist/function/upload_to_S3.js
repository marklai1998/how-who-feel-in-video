'use strict';

var AWS = require('aws-sdk');

function S3(bucket, key, file) {
    this.bucket = bucket;
    this.key = key;
    this.file = file.data;
}

S3.prototype.save = function () {
    var bucket = this.bucket;
    var key = this.key;
    var file = this.file;
    var s3 = new AWS.S3();
    var params = { Bucket: bucket, Key: key, Body: file };
    // s3.putObject(params, function (err, data) {
    //     if (err) {
    //         console.log(err)
    //     } else {
    //         console.log("Successfully uploaded data to myBucket/myKey");
    //     }
    // });
};

module.exports = S3;
//# sourceMappingURL=upload_to_S3.js.map