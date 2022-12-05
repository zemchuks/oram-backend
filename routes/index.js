"use strict"

var exports = {}

exports.setup = function (app) {
    console.log("Setup Route");
     
    var superAdmin = require("./superAdmin");
    var users = require("./user");
    var product = require("./product");
    var country = require("./country");
    var entities = require("./entities");
    var transaction = require("./transaction");
    var ratingAgencies = require("./ratingAgencies");
    var riskAssessment = require("./riskAssessment");
    var port = require("./port");
    var airBase = require("./airBase");

    app.use('/superAdmin',superAdmin)
    app.use('/user',users)
    app.use('/product',product)
    app.use('/country',country)
    app.use('/entities',entities)
    app.use('/ratingAgencies',ratingAgencies)
    app.use('/transaction',transaction)
    app.use('/riskAssessment',riskAssessment)
    app.use('/port',port)
    app.use('/airBase',airBase)
};

module.exports = exports;