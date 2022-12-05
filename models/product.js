"use strict"

const mongoose = require('mongoose')
const { ProductNatureTypes, ProductFamilyTypes, ProductCategoryTypes, ProductTypes } = require('../utils/enums')
var Schema = mongoose.Schema

var Schema = new Schema({
    name: { type: String, required: true, default: null },
    nature: { type: String, required: false, enum: ProductNatureTypes },
    family: { type: String, required: false, enum: ProductFamilyTypes },
    category: { type: String, required: false, enum: ProductCategoryTypes },
    type: { type: String, required: false, enum: ProductTypes },
    unit: { type: String, required: false, default: null },
    matric: { type: String, required: false, default: null },
    status: { type: String, required: false, default: null },
    expiryDate: { type: Date, required: false, default: null },
    isApproved: { type: Boolean, required: true, default: false },
    isDeleted: { type: Boolean, required: true, default: false }
}, {
    timestamps: true
})

Schema.index({ name: "text" })

Schema.statics.createProduct = async function () {
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

Schema.statics.updateProduct = async function (data, id) {
    return await this.findOneAndUpdate({
        _id: id
    }, {
        $set: data
    }, {
        new: true
    })
}

Schema.statics.deleteProduct = async function (id) {
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

Schema.statics.getProductsFromArrayOfIds = async function (ids) {
    return await this.find({
        '_id': { $in: ids }
    }).select("name")

}

module.exports = mongoose.model("Product", Schema)