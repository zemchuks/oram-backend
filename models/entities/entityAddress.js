"use strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

var Schema = new Schema({
    entityId: { type: String, required: true, default: null },
    type: { type: String, required: true, default: null },
    flatNumber: { type: String, required: false, default: null },
    addressLine1: { type: String, required: false, default: null },
    addressLine2: { type: String, required: false, default: null },
    addressLine3: { type: String, required: false, default: null },
    postcode: { type: String, required: false, default: null },
    state: { type: String, required: false, default: null },
    city: { type: String, required: false, default: null },
    country: { type: Schema.Types.ObjectId, ref: "Countries", required: false, default: null },
    mobile: { type: String, required: false, default: null },
    telephone: { type: String, required: false, default: null },
    fax: { type: String, required: false, default: null },
    email: { type: String, required: false, default: null },
    isDeleted: { type: Boolean, required: false, default: false },
}, {
    timestamps: true
})

Schema.index({ name: "text" })

Schema.statics.createEntityAddress = async function () {
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

Schema.statics.updateEntityAddress = async function (data, id) {
    return await this.findOneAndUpdate({
        _id: id
    }, {
        $set: data
    }, {
        new: true
    })
}

Schema.statics.deleteEntityAddress = async function (id) {
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

Schema.statics.getEntityAddressFromArrayOfIds = async function (ids) {
    return await this.find({
        '_id': { $in: ids }
    }).select("name")

}

module.exports = mongoose.model("EntityAddress", Schema)