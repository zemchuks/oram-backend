"use strict";

const airBase = require("../models/airBase");
const httpStatus = require('http-status');
const APIResponse = require("../helpers/APIResponse");
const { hashPassword, comparePassword } = require("../utils/bcrypt.helper");
const { getJWTToken } = require("../utils/jwt.helper");

class PortController {
    async getAll(req, res, next) {
        let params = req.params;
        let name = params.name;
        try {
            let airBases = []
            if (name !== "all") {
                airBases = await airBase.getAllBySearch(name.toLowerCase().toUpperCase())
            } else {
                airBases = await airBase.getAll()
            }
            return res.status(httpStatus.OK).json(new APIResponse(airBases, 'airBases fetch successfully.', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error in fetching airBases', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }
    async edit(req, res, next) {
        let body = req.body;
        let id = body._id;
        try {
            const airBaseAfterEdit = await airBase.updateAirBase(body, id)
            return res.status(httpStatus.OK).json(new APIResponse(airBaseAfterEdit, 'AirBase updated successfully.', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error in updating airBase', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }
}
var exports = (module.exports = new PortController());