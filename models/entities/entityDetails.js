"use strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

var Schema = new Schema({
    entityId: { type: String, required: true, default: null },
    name: { type: String, required: false, default: null },
    title: { type: String, required: false, default: null },
    country: { type: Schema.Types.ObjectId, ref: "Countries", required: false, default: null },
    registrationNumber: { type: String, required: false, default: null },
    dateOfIncorporation: { type: Date, required: false, default: null },
    sector: { type: String, required: false, default: null },
    subSector: { type: String, required: false, default: null },
    mainActivity: { type: String, required: false, default: null },
    givenName: { type: String, required: false, default: null },
    surname: { type: String, required: false, default: null },
    otherNames: { type: String, required: false, default: null },
    birthDate: { type: Date, required: false, default: null },
    townOfBirth: { type: String, required: false, default: null },
    stateOfBirth: { type: String, required: false, default: null },
    isDeleted: { type: Boolean, required: true, default: false },
}, {
    timestamps: true
})

Schema.index({ name: "text" })

Schema.statics.createEntityDetail = async function () {
    return await this.Save()
}

Schema.statics.getAll = async function () {
    return await this.find({ isDeleted: false }).populate('countryOfBirth').sort({ name: 1 }).exec();
}
Schema.statics.getAllBySearch = async function (search) {
    return await this.find({ name: { $in: [new RegExp(`.*${search}.*`, 'gi')] }, isDeleted: false }).sort({ name: 1 });
}

Schema.statics.getById = async function (id) {
    return await this.findOne({ _id: id, isDeleted: false }).populate('countryOfBirth').exec();
}

Schema.statics.updateEntityDetail = async function (data, id) {
    return await this.findOneAndUpdate({
        _id: id
    }, {
        $set: data
    }, {
        new: true
    })
}

Schema.statics.deleteEntityDetail = async function (id) {
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

Schema.statics.getEntityDetailsFromArrayOfIds = async function (ids) {
    return await this.find({
        '_id': { $in: ids }
    }).select("name")

}

module.exports = mongoose.model("EntityDetails", Schema)