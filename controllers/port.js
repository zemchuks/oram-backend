"use strict";

const port = require("../models/port");
const httpStatus = require('http-status');
const APIResponse = require("../helpers/APIResponse");
const { hashPassword, comparePassword } = require("../utils/bcrypt.helper");
const { getJWTToken } = require("../utils/jwt.helper");

class PortController {
    async getAll(req, res, next) {
        let params = req.params;
        let name = params.name;
        try {
            let ports = []
            console.log('name', name)
            if (name !== "all") {
                ports = await port.getAllBySearch(name.toLowerCase().toUpperCase())
            } else {
                ports = await port.getAll()
            }
            return res.status(httpStatus.OK).json(new APIResponse(ports, 'Ports fetch successfully.', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error in fetching Ports', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }
    async edit(req, res, next) {
        let body = req.body;
        let id = body._id;
        try {
            const portAfterEdit = await port.updatePort(body, id)
            return res.status(httpStatus.OK).json(new APIResponse(portAfterEdit, 'Port updated successfully.', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error in updating port', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }
}
var exports = (module.exports = new PortController());