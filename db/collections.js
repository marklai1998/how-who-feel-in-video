const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let VideoSchema = new Schema(
    {
        size: {type: String},
        videos:{type: String},
        created_at: {type: Date, default: Date.now}
    }
);

mongoose.model('collections', VideoSchema);

