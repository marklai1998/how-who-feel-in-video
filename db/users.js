const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let UserSchema = new Schema(
    {
        username: {type: String, unique: true},
        password: {type: String},
        created_at: {type: Date, default: Date.now},
        updated_at: {type: Date, default: Date.now}
    }
);

mongoose.model('users', UserSchema);

