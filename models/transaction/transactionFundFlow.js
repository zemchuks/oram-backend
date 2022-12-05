"use strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

var LettersOfCredit = new Schema({
    applicant: { type: Schema.Types.ObjectId, ref: "Entity", required: false, default: null },
    issuingBank: { type: Schema.Types.ObjectId, ref: "Entity", required: false, default: null },
    beneficiary: { type: Schema.Types.ObjectId, ref: "Entity", required: false, default: null },
    advisingBank: { type: Schema.Types.ObjectId, ref: "Entity", required: false, default: null },
    confirmingBank: { type: Schema.Types.ObjectId, ref: "Entity", required: false, default: null },
    negotiatingBank: { type: Schema.Types.ObjectId, ref: "Entity", required: false, default: null },
    secondBeneficiary: { type: Schema.Types.ObjectId, ref: "Entity", required: false, default: null },
    reimbursingBank: { type: Schema.Types.ObjectId, ref: "Entity", required: false, default: null },
})

var Schema = new Schema({
    transactionId: { type: String, required: true, default: null },
    contractCurrency: { type: String, required: false, default: null },
    contractValue: { type: String, required: false, default: null },
    paymentMethod: { type: String, required: false, default: null },
    openAccount: { type: String, required: false, default: null },
    lettersOfCredit: { type: [LettersOfCredit], required: false, default: null },
    paymentDate: { type: String, required: false, default: null },
    terms: { type: String, required: false, default: null },
    paymentOrigin: { type: Schema.Types.ObjectId, ref: "Countries", required: false, default: null },
    beneficiary: { type: Schema.Types.ObjectId, ref: "Entity", required: false, default: null },
    additonalCharges: { type: Boolean, required: true, default: false },
    payer: { type: Schema.Types.ObjectId, ref: "Entity", required: false, default: null },
    dutiesCurrency: { type: String, required: false, default: null },
    dutiesValue: { type: String, required: false, default: null },
    taxesCurrency: { type: String, required: false, default: null },
    taxesValue: { type: String, required: false, default: null },
    certificationCurrency: { type: String, required: false, default: null },
    certificationValue: { type: String, required: false, default: null },
    leviesCurrency: { type: String, required: false, default: null },
    leviesValue: { type: String, required: false, default: null },
    isDeleted: { type: Boolean, required: true, default: false },
}, {
    timestamps: true
})

Schema.index({ name: "text" })

Schema.statics.createTransactionFundFlow = async function () {
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

Schema.statics.updateTransactionFundFlow = async function (data, id) {
    return await this.findOneAndUpdate({
        _id: id
    }, {
        $set: data
    }, {
        new: true
    })
}

Schema.statics.deleteTransactionFundFlow = async function (id) {
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

Schema.statics.getTransactionFundFlowFromArrayOfIds = async function (ids) {
    return await this.find({
        '_id': { $in: ids }
    }).select("name")

}

module.exports = mongoose.model("TransactionFundFlow", Schema)  