"use strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

var Schema = new Schema({
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    name: { type: String, required: true },
    country: { type: String, required: true },
    countryId: { type: Schema.Types.ObjectId, ref: "Countries", required: true },
    refcode: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false }
}, {
    timestamps: true
})
Schema.statics.getAll = async function () {
    // if (search) {
    //     return await this.find({ country: { $in: [new RegExp(`.*${search}.*`, 'gi')] }, isDeleted: false }).sort({ name: 1 }).exec();
    // } else {
    return await this.find({ isDeleted: false }).sort({ name: 1 }).exec();
    // }
}
Schema.statics.getAllBySearch = async function (search) {
    // return await this.find({ country: search, isDeleted: false }).sort({ name: 1 });
    return await this.find({ country: { $in: [new RegExp(`.*${search}.*`, 'gi')] }, isDeleted: false }).sort({ name: 1 });
}
Schema.statics.getByCountry = async function (search) {
    // return await this.find({ country: search, isDeleted: false }).sort({ name: 1 });
    return await this.find({ country: search, isDeleted: false }).sort({ name: 1 });
}
Schema.statics.updateCountry = async function (data, id) {
    return await this.updateMany({
        countryId: id
    }, {
        $set: data
    }, {
        new: true
    })
}
Schema.statics.updatePort = async function (data, id) {
    return await this.findOneAndUpdate({
        _id: id
    }, {
        $set: data
    }, {
        new: true
    })
}
module.exports = mongoose.model("Port", Schema)