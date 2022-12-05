"use strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

var Schema = new Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false }
}, {
    timestamps: true
})
Schema.statics.getAll = async function () {
    return await this.find({ isDeleted: false }).sort({ name: 1 }).exec();
}
Schema.statics.getAllBySearch = async function (search) {
    return await this.find({ name: { $in: [new RegExp(`.*${search}.*`,'gi')] }, isDeleted: false }).sort({ name: 1 });
}

Schema.statics.updateCountry = async function (data,id) {
    return await this.findOneAndUpdate({
        _id: id
    }, {
        $set: data
    }, {
        new: true
    })
}

module.exports = mongoose.model("Countries", Schema)