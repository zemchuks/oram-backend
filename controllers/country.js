"use strict";

const country = require("../models/countries");
const port = require("../models/port");
const airBase = require("../models/airBase");
const httpStatus = require('http-status');
const APIResponse = require("../helpers/APIResponse");
const { hashPassword, comparePassword } = require("../utils/bcrypt.helper");
const { getJWTToken } = require("../utils/jwt.helper");

class CountryController {
    async getAll(req, res, next) {
        let params = req.params;
        let name = params.name;
        try {
            let countries = []
            if (name !== "all") {
                countries = await country.getAllBySearch(name.toLowerCase().toUpperCase())
            } else {
                countries = await country.getAll()
            }
            return res.status(httpStatus.OK).json(new APIResponse(countries, 'Countries fetch successfully.', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error in fetching countries', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }
    async edit(req, res, next) {
        let body = req.body;
        let id = body._id;
        try {
            // let countries = []
            // if (name !== "all") {
            const countrAfterEdit = await country.updateCountry(body, id)
            const portAfterEdit = await port.updateCountry({ country: body.name }, id)
            const airbaseAfterEdit = await airBase.updateCountry({ country: body.name }, id)
            // } else {
            //     countries = await country.getAll()
            // }
            return res.status(httpStatus.OK).json(new APIResponse(countrAfterEdit, 'Countries updated successfully.', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error in updating countries', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }
}
var exports = (module.exports = new CountryController());