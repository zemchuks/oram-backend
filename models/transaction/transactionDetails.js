"use strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

var Warehouses = new Schema({
    warehouseCompany: { type: Schema.Types.ObjectId, ref: "Entity", required: false },
    warehouse: { type: Schema.Types.ObjectId, ref: "EntityWarehouse", required: false }
})
var ProductDetails = new Schema({
    nature: { type: String, require: false, default: null },
    type: { type: String, require: false, default: null },
    commodityType: { type: String, require: false, default: null },
    commoditySubType: { type: String, require: false, default: null },
    name: { type: Schema.Types.ObjectId, ref: "Product", required: false },
    quantity: { type: String, require: false, default: null },
    metric: { type: String, require: false, default: null },
    quality: { type: String, require: false, default: null },
})
var ContractDetails = new Schema({
    currency: { type: String, require: false, default: null },
    value: { type: String, require: false, default: null },
    contractDate: { type: Date, require: false, default: null },
    expiryDate: { type: Date, require: false, default: null },
    conditionsOfContract: { type: String, require: false, default: null },
    descriptionOfContract: { type: String, require: false, default: null }
})
var ShippingOptions = new Schema({
    shipmentDate: { type: Date, require: false, default: null },
    shipmentMode: { type: String, require: false, default: null },
    countryOfOrigin: { type: Schema.Types.ObjectId, ref: "Countries", required: false, default: null },
    portOfOrigin: { type: Schema.Types.ObjectId, ref: "Port", required: false, default: null },
    airbaseOfOrigin: { type: Schema.Types.ObjectId, ref: "AirBase", required: false, default: null },
    shipmentTerms: { type: String, require: false, default: null },
    shippedWeights: { type: String, require: false, default: null },
    destinationCountry: { type: Schema.Types.ObjectId, ref: "Countries", required: false, default: null },
    destinationPort: { type: Schema.Types.ObjectId, ref: "Port", required: false, default: null },
    destinationAirbase: { type: Schema.Types.ObjectId, ref: "AirBase", required: false, default: null },
    shipmentFrequency: { type: String, require: false, default: null },
    warehouseRequired: { type: Boolean, require: false, default: false },
    warehouses: [Warehouses],
})
var InsurancesOptions = new Schema({
    insurer: { type: Schema.Types.ObjectId, ref: "Entity", required: false, default: null },
    broker: { type: Schema.Types.ObjectId, ref: "Entity", required: false, default: null },
    insuranceType: { type: String, required: false, default: null },
    currencyOfCoverage: { type: String, required: false, default: null },
    coverageValue: { type: String, required: false, default: null },
    insuredParty: { type: Schema.Types.ObjectId, ref: 'Entity', required: false, default: null },
    reInsured: { type: Schema.Types.ObjectId, ref: 'Entity', required: false, default: null },
    underWriter: { type: Schema.Types.ObjectId, ref: 'Entity', required: false, default: null },
    restriction: { type: Boolean, required: false, default: false },
    evidence: { type: String, required: false, default: null },
    clauses: { type: String, required: false, default: null },
    restrictionsComments: { type: String, required: false, default: null },
})
var TransShipmentOptions = new Schema({
    tranShipmentRequired: { type: Boolean, require: true, default: false },
    street: { type: String, require: false, default: null },
    city: { type: String, require: false, default: null },
    country: { type: Schema.Types.ObjectId, ref: "Countries", required: false, default: null },
    transShipmentQuantity: { type: String, require: false, default: null },
    transShipmentDate: { type: Date, require: false, default: null }
})
var PricingDetailOptions = new Schema({
    pricingType: { type: String, require: false, default: null },
    pricingAmount: { type: String, require: false, default: null },
    pricingUnit: { type: String, require: false, default: null },
    previousDayClosingAmount: { type: String, require: false, default: null },
    pricingFormula: { type: String, require: false, default: null },
    pricingHedgingStatus: { type: Boolean, require: false, default: false },
    pricingHedgingMethod: { type: String, require: false, default: false },
    pricingCounterParty: { type: Schema.Types.ObjectId, ref: 'Entity', require: false, default: null },
})

var Schema = new Schema({
    transactionId: { type: String, required: true, default: null },
    productDetails: { type: ProductDetails, required: false, default: null },
    contractDetails: { type: ContractDetails, required: false, default: null },
    shippingOptions: { type: ShippingOptions, required: false, default: null },
    transShipmentOptions: { type: TransShipmentOptions, required: false, default: null },
    insurances: { type: [InsurancesOptions], required: false, default: null },
    pricingDetails: { type: PricingDetailOptions, required: false, default: null },
    isDeleted: { type: Boolean, required: true, default: false },
}, {
    timestamps: true
})

Schema.index({ name: "text" })

Schema.statics.createTransactionDetail = async function () {
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

Schema.statics.updateTransactionDetail = async function (data, id) {
    return await this.findOneAndUpdate({
        _id: id
    }, {
        $set: data
    }, {
        new: true
    })
}

Schema.statics.deleteTransactionDetail = async function (id) {
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

Schema.statics.getTransactionDetailsFromArrayOfIds = async function (ids) {
    return await this.find({
        '_id': { $in: ids }
    }).select("name")

}

module.exports = mongoose.model("TransactionDetails", Schema)  