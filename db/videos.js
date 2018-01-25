const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let VideoSchema = new Schema(
    {
        file_name: {type: String},
        file_type: {type: String},
        size: {type: String},
        duration: {type: String},
        dimension: {type: String},
        created_at: {type: Date, default: Date.now}
    }
);

mongoose.model('videos', VideoSchema);

