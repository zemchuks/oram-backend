"use strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

const RoleSchema = new Schema({
    roleId: { type: Schema.Types.ObjectId, ref: "EntityRoles", required: false },
    justification: { type: String, require: false, default: null }
})


var Schema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    type: { type: String, required: true },
    details: { type: Schema.Types.ObjectId, ref: "EntityDetails", required: false },
    addresses: [{ type: Schema.Types.ObjectId, ref: "EntityAddress", required: false }],
    financial: { type: Schema.Types.ObjectId, ref: "EntityFinancial", required: false },
    licenses: [{ type: Schema.Types.ObjectId, ref: "EntityLicense", required: false }],
    ratings: [{ type: Schema.Types.ObjectId, ref: "EntityRating", required: false }],
    warehouses: [{ type: Schema.Types.ObjectId, ref: "EntityWarehouse", required: false }],
    roles: [RoleSchema],
    isDeleted: { type: Boolean, required: true, default: false },
}, {
    timestamps: true
})

Schema.index({ name: "text" })

Schema.statics.createEntity = async function () {
    return await this.Save()
}

Schema.statics.getAll = async function () {
    return await this.find({ isDeleted: false })
        .populate({
            path: "details",
            populate: {
                path: "country",
            }
        })
        .populate({
            path: "addresses",
            populate: {
                path: "country",
            }
        })
        .populate({
            path: "roles",
            populate: {
                path: "roleId",
            }
        })
        .populate('financial')
        .populate('licenses')
        .populate('ratings')
        .populate('warehouses')
        .sort({ name: 1 }).exec();
}
Schema.statics.getAllBySearch = async function (search) {
    return await this.find({ name: { $in: [new RegExp(`.*${search}.*`, 'gi')] }, isDeleted: false })
        .populate({
            path: "details",
            populate: {
                path: "country",
            }
        })
        .populate({
            path: "addresses",
            populate: {
                path: "country",
            }
        })
        .populate({
            path: "roles",
            populate: {
                path: "roleId",
            }
        })
        .populate('financial')
        .populate('licenses')
        .populate('ratings')
        .populate('warehouses').sort({ name: 1 });
}
Schema.statics.getByType = async function (type) {
    return await this.find({ type: type, isDeleted: false })
        .populate({
            path: "details",
            populate: {
                path: "country",
            }
        })
        .populate({
            path: "addresses",
            populate: {
                path: "country",
            }
        })
        .populate({
            path: "roles",
            populate: {
                path: "roleId",
            }
        })
        .populate('financial')
        .populate('licenses')
        .populate('ratings')
        .populate('warehouses').sort({ name: 1 });
}

Schema.statics.getById = async function (id) {
    return await this.findOne({ _id: id, isDeleted: false })
        .populate({
            path: "details",
            populate: {
                path: "country",
            }
        })
        .populate({
            path: "addresses",
            populate: {
                path: "country",
            }
        })
        .populate({
            path: "roles",
            populate: {
                path: "roleId",
            }
        })
        .populate('financial')
        .populate('licenses')
        .populate('ratings')
        .populate('warehouses').exec();
}
Schema.statics.getByEmail = async function (email) {
    return await this.findOne({ email: email, isDeleted: false })
        .populate({
            path: "details",
            populate: {
                path: "country",
            }
        })
        .populate({
            path: "addresses",
            populate: {
                path: "country",
            }
        })
        .populate({
            path: "roles",
            populate: {
                path: "roleId",
            }
        })
        .populate('financial')
        .populate('licenses')
        .populate('ratings')
        .populate('warehouses').exec();
}

Schema.statics.updateEntity = async function (data, id) {
    return await this.findOneAndUpdate({
        _id: id
    }, {
        $set: data
    }, {
        new: true
    }).populate({
        path: "details",
        populate: {
            path: "country",
        }
    })
        .populate({
            path: "addresses",
            populate: {
                path: "country",
            }
        })
        .populate({
            path: "roles",
            populate: {
                path: "roleId",
            }
        })
        .populate('financial')
        .populate('licenses')
        .populate('ratings')
        .populate('warehouses')
}

Schema.statics.deleteEntity = async function (id) {
    return await this.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            isDeleted: true
        }
    }, {
        new: true
    }).populate({
        path: "details",
        populate: {
            path: "country",
        }
    })
        .populate({
            path: "addresses",
            populate: {
                path: "country",
            }
        })
        .populate({
            path: "roles",
            populate: {
                path: "roleId",
            }
        })
        .populate('financial')
        .populate('licenses')
        .populate('ratings')
        .populate('warehouses')

}

Schema.statics.getEntitiesFromArrayOfIds = async function (ids) {
    return await this.find({
        '_id': { $in: ids }
    }).select("name").populate({
        path: "details",
        populate: {
            path: "country",
        }
    })
        .populate({
            path: "addresses",
            populate: {
                path: "country",
            }
        })
        .populate({
            path: "roles",
            populate: {
                path: "roleId",
            }
        })
        .populate('financial')
        .populate('licenses')
        .populate('ratings')
        .populate('warehouses')

}

module.exports = mongoose.model("Entity", Schema)