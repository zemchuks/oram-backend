"use strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

var Schema = new Schema({
    transactionId: { type: String, required: true, default: null },
    documentRemittance: { type: String, required: false, default: null },
    details: { type: String, required: false, default: null }
}, {
    timestamps: true
})

Schema.index({ name: "text" })

Schema.statics.createTransactionDocumentFlow = async function () {
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

Schema.statics.updateTransactionDocumentFlow = async function (data, id) {
    return await this.findOneAndUpdate({
        _id: id
    }, {
        $set: data
    }, {
        new: true
    })
}

Schema.statics.deleteTransactionDocumentFlow = async function (id) {
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

Schema.statics.getTransactionDocumentFlowFromArrayOfIds = async function (ids) {
    return await this.find({
        '_id': { $in: ids }
    }).select("name")

}

module.exports = mongoose.model("TransactionDocumentFlow", Schema)  