"use strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

var Schema = new Schema({
    entityId: { type: String, required: true, default: null },
    agency: { type: String, required: false, default: null },
    rating: { type: String, required: false, default: null },
    dateOfRating: { type: Date, required: false, default: null },
    expiryDate: { type: Date, required: false, default: null },
    isDeleted: { type: Boolean, required: false, default: false },
}, {
    timestamps: true
})

Schema.index({ name: "text" })

Schema.statics.createEntityRating = async function () {
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

Schema.statics.getByEntityId = async function (id) {
    return await this.find({ entityId: id, isDeleted: false }).exec();
}

Schema.statics.updateEntityRating = async function (data, id) {
    return await this.findOneAndUpdate({
        _id: id
    }, {
        $set: data
    }, {
        new: true
    })
}

Schema.statics.deleteEntityRating = async function (id) {
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

Schema.statics.getEntityRatingFromArrayOfIds = async function (ids) {
    return await this.find({
        '_id': { $in: ids }
    }).select("name")

}

module.exports = mongoose.model("EntityRating", Schema)