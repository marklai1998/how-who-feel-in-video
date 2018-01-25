'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var VideoSchema = new Schema({
    file_name: { type: String },
    file_type: { type: String },
    size: { type: String },
    duration: { type: String },
    dimension: { type: String },
    created_at: { type: Date, default: Date.now }
});

mongoose.model('videos', VideoSchema);
//# sourceMappingURL=videos.js.map