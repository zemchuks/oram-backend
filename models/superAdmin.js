"use strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

var Schema = new Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
}, {
    timestamps: true
})

Schema.statics.createUser = async function () {
    return await this.Save()
}

Schema.statics.getAdminByEmail = async function (loginUser) {
    return await this.findOne({ email: loginUser, isDeleted: false }).exec()
}

module.exports = mongoose.model("Admin", Schema)