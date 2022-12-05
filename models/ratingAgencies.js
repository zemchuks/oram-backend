"use strict"

const mongoose = require('mongoose')
const { ProductNatureTypes, ProductFamilyTypes, ProductCategoryTypes, ProductTypes } = require('../utils/enums')
var Schema = mongoose.Schema

const RatingSchema = new Schema({
    grade: { type: String, require: true },
    value: { type: String, require: true },
    acceptable: { type: Boolean, require: true, default: false },
    comments: { type: String, require: true },
})

var Schema = new Schema({
    name: { type: String, required: true },
    street: { type: String, required: false },
    addressLine2: { type: String, required: false },
    addressLine3: { type: String, required: false },
    city: { type: String, required: false },
    postcode: { type: String, required: false },
    state: { type: String, required: true, default: false },
    country: { type: String, required: true, default: false },
    ratingSchema: [RatingSchema],
    isDeleted: { type: Boolean, required: true, default: false }
}, {
    timestamps: true
})

Schema.index({ name: "text" })

Schema.statics.createRatingAgency = async function () {
    return await this.Save()
}

Schema.statics.getAll = async function () {
    return await this.find({ isDeleted: false }).sort({ name: 1 }).exec();
}
Schema.statics.getAllBySearch = async function (search) {
    return await this.find({ name: { $in: [new RegExp(`.*${search}.*`, 'gi')] }, isDeleted: false }).sort({ name: 1 });
}

Schema.statics.getById = async function (id) {
    return await this.findOne({ _id: id, isDeleted: false }).exec();
}

Schema.statics.updateRatingAgency = async function (data, id) {
    return await this.findOneAndUpdate({
        _id: id
    }, {
        $set: data
    }, {
        new: true
    })
}

Schema.statics.deleteRatingAgency = async function (id) {
    return await this.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            isDeleted: true
        }
    }, {
        new: true
    })

}

Schema.statics.getRatingAgenciesFromArrayOfIds = async function (ids) {
    return await this.find({
        '_id': { $in: ids }
    }).select("name")

}

module.exports = mongoose.model("RatingAgencies", Schema) 