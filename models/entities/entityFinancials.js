"use strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

var Schema = new Schema({
    entityId: { type: String, required: true },
    netProfitMargin: { type: Number, required: true },
    ROE: { type: Number, required: true },
    ROA: { type: Number, required: true },
    operatingCashFlow: { type: Number, required: true },
    debtServiceCoverageRatio: { type: Number, required: true },
    interestCoverageRatio: { type: Number, required: true },
    netGearingRatio: { type: Number, required: true },
    totalDebtToTotalCapital: { type: Number, required: true },
    currentRatio: { type: Number, required: true },
    quickRatio: { type: Number, required: true },
    cashFlowBeforeFinancingSales: { type: Number, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
}, {
    timestamps: true
})

Schema.index({ name: "text" })

Schema.statics.createEntityFinancial = async function () {
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

Schema.statics.updateEntityFinancial = async function (data, id) {
    return await this.findOneAndUpdate({
        _id: id
    }, {
        $set: data
    }, {
        new: true
    })
}

Schema.statics.deleteEntityFinancial = async function (id) {
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

Schema.statics.getEntityFinancialFromArrayOfIds = async function (ids) {
    return await this.find({
        '_id': { $in: ids }
    }).select("name")

}

module.exports = mongoose.model("EntityFinancial", Schema)