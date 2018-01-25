'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var AWS = require('aws-sdk');

exports.upload = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(bucket, key, file) {
        var s3, params;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        console.log(file.data);
                        s3 = new AWS.S3();
                        params = { Bucket: bucket, Key: key, Body: file.data };
                        _context.prev = 3;
                        _context.next = 6;
                        return s3.putObject(params, function (err, data) {
                            if (err) console.log(err, err.stack); // an error occurred
                            else console.log(data); // successful response
                        });

                    case 6:
                        _context.next = 11;
                        break;

                    case 8:
                        _context.prev = 8;
                        _context.t0 = _context['catch'](3);
                        return _context.abrupt('return', _context.t0);

                    case 11:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[3, 8]]);
    }));

    return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
}();
//# sourceMappingURL=s3_file.js.map