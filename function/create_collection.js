const mongoose = require('mongoose');
const collections = mongoose.model('collections');

const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');

exports.remove = async (id, callback) => {
    try {
        await rimraf('./public/collections/' + id, function (err) {
        });
        await collections.find({_id: id}).remove().exec();
        await callback();
    } catch (err) {
        return err
    }
};

exports.create = async (size,videos, callback) => {
    try {
        const collection = await collections({
            size: size,
            videos: videos
        }).save();
        const id = collection.id;
        await fs.mkdir('./public/collections/' + id);
        await callback();
    } catch (err) {
        return err
    }
};