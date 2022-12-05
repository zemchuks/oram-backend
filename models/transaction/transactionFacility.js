"use strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

const CurrencyHedgeDetails = new Schema({
    hedgingMethod: { type: String, required: false, default: null },
    counterParty: { type: Schema.Types.ObjectId, ref: "Entity", require: false, default: null }
})

const SourceOfRepayment = new Schema({
    type: { type: String, required: false, default: null },
    instrument: { type: String, required: false, default: null },
    evidence: { type: String, required: false, default: null },
})

const SecurityDocuments = new Schema({
    type: { type: String, required: false, default: null },
    name: { type: String, required: false, default: null },
    file: { type: String, required: false, default: null },
})


var Schema = new Schema({
    transactionId: { type: String, required: false, default: null },
    interestRate: { type: String, required: false, default: null },
    advisoryFee: { type: String, required: false, default: null },
    agencyFee: { type: String, required: false, default: null },
    margin: { type: String, required: false, default: null },
    defaultInterest: { type: String, required: false, default: null },
    representations: { type: String, required: false, default: null },
    eventsOfDefault: { type: String, required: false, default: null },
    miscellaneousProvisions: { type: String, required: false, default: null },
    generalUndertakings: { type: String, required: false, default: null },
    interestPeriod: { type: String, required: false, default: null },
    interestPaymentDate: { type: Date, required: false, default: null },
    tenor: { type: String, required: false, default: null },
    managementFee: { type: String, required: false, default: null },
    drawdownFee: { type: String, required: false, default: null },
    commitmentFee: { type: String, required: false, default: null },
    lateInterestCharges: { type: String, required: false, default: null },
    prePayment: { type: String, required: false, default: null },
    cancellationFee: { type: String, required: false, default: null },
    type: { type: String, required: false, default: null },
    currency: { type: String, required: false, default: null },
    amount: { type: String, required: false, default: null },
    rePaymentCurrency: { type: String, required: false, default: null },
    currencyHedge: { type: Boolean, required: false, default: false },
    currencyHedgeDetails: { type: [CurrencyHedgeDetails], required: false, default: null },
    loanPurposeValidity: { type: String, required: false, default: null },
    goods: { type: String, required: false, default: null },
    workingCapital: { type: String, required: false, default: null },
    sourceOfRepayment: { type: [SourceOfRepayment], required: false, default: null },
    disbursementMechanism: { type: String, required: false, default: null },
    securityUndertaking: { type: String, required: false, default: null },
    controlAccounts: { type: String, required: false, default: null },
    finalMaturity: { type: Date, required: false, default: null },
    documentation: { type: String, required: false, default: null },
    conditionsPrecedent: { type: String, required: false, default: null },
    conditionsSubsequent: { type: String, required: false, default: null },
    borrowerAffirmativeCovenants: { type: String, required: false, default: null },
    financialCovenants: { type: String, required: false, default: null },
    informationCovenants: { type: String, required: false, default: null },
    assignments: { type: String, required: false, default: null },
    taxationDuties: { type: String, required: false, default: null },
    expenses: { type: String, required: false, default: null },
    approvals: { type: String, required: false, default: null },
    governingLaw: { type: String, required: false, default: null },
    jurisdiction: { type: String, required: false, default: null },
    forceMajeure: { type: String, required: false, default: null },
    availabilityPeriod: { type: String, required: false, default: null },
    securityDocuments: { type: [SecurityDocuments], required: false, default: null },
    repayment: { type: String, required: false, default: null },
    transactionStructure: { type: String, required: false, default: null },
    permittedAccounts: { type: String, required: false, default: null },
    isDeleted: { type: Boolean, required: false, default: false },
}, {
    timestamps: true
})

Schema.index({ name: "text" })

Schema.statics.createTransactionFacility = async function () {
    return await this.Save()
}

Schema.statics.getAll = async function () {
    return await this.find({ isDeleted: false })
        .populate({
            path: "details"
        })
        .populate({
            path: "addresses"
        })
        .populate({
            path: "roles"
        })
        .populate('financial')
        .populate('licenses')
        .populate('ratings')
        .populate('warehouses')
        .sort({ name: 1 }).exec();
}
Schema.statics.getAllBySearch = async function (search) {
    return await this.find({ name: { $in: [new RegExp(`.*${search}.*`, 'gi')] }, isDeleted: false }).sort({ name: 1 });
}

Schema.statics.getById = async function (id) {
    return await this.findOne({ _id: id, isDeleted: false })
        .populate({
            path: "details"
        })
        .populate({
            path: "addresses"
        })
        .populate({
            path: "roles"
        })
        .populate('financial')
        .populate('licenses')
        .populate('ratings')
        .populate('warehouses').exec();
}
Schema.statics.getByEmail = async function (email) {
    return await this.findOne({ email: email, isDeleted: false })
        .populate({
            path: "details"
        })
        .populate({
            path: "addresses"
        })
        .populate({
            path: "roles"
        })
        .populate('financial')
        .populate('licenses')
        .populate('ratings')
        .populate('warehouses').exec();
}

Schema.statics.updateTransactionFacility = async function (data, id) {
    return await this.findOneAndUpdate({
        _id: id
    }, {
        $set: data
    }, {
        new: true
    })
}

Schema.statics.deleteTransactionFacility = async function (id) {
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

Schema.statics.getTransactionFacilitiesFromArrayOfIds = async function (ids) {
    return await this.find({
        '_id': { $in: ids }
    }).select("name")

}

module.exports = mongoose.model("TransactionFacility", Schema)