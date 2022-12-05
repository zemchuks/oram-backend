"use strict";

const RiskAssessment = require("../models/riskAssessment");
const httpStatus = require('http-status');
const APIResponse = require("../helpers/APIResponse");
const { hashPassword, comparePassword } = require("../utils/bcrypt.helper");
const { getJWTToken } = require("../utils/jwt.helper");

class RiskAssessmentController {
    async getAll(req, res, next) {
        try {
            let riskAssessment = await RiskAssessment.getAll()
            return res.status(httpStatus.OK).json(new APIResponse(riskAssessment, 'Risk assessment fetch successfully.', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error in fetching risk Assessment', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }
    async create(req, res, next) {
        let body = req.body;
        const model = new RiskAssessment(body);

        try {
            const alreadyExist = await RiskAssessment.getByTransactionId(body.transactionId)
            if (!alreadyExist) {
                const saveResponse = await model.save();
                return res.status(httpStatus.OK).json(new APIResponse(saveResponse, 'Risk assessment added successfully.', httpStatus.OK));
            } else {
                return res.status(httpStatus.OK).json(new APIResponse({}, 'Risk assessment already exist.', httpStatus.OK));
            }
        } catch (e) {
            if (e.code === 11000) {
                return res
                    .status(httpStatus.OK)
                    .send({ message: "Risk assessment is already exist with this transaction." });
            } else {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error adding Risk assessment', httpStatus.INTERNAL_SERVER_ERROR, e));
            }
        }
    }

    async getById(req, res, next) {
        let params = req.params;
        let id = params.id;
        try {
            const Data = await RiskAssessment.getByTransactionId(id)
            return res.status(httpStatus.OK).json(new APIResponse(Data, 'Risk assessment fetch successfully.', httpStatus.OK));

        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error in fetching risk assessment', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

}

var exports = (module.exports = new RiskAssessmentController());