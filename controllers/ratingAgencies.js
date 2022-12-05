"use strict";

const RatingAgencies = require("../models/ratingAgencies");
const httpStatus = require('http-status');
const APIResponse = require("../helpers/APIResponse");
const { hashPassword, comparePassword } = require("../utils/bcrypt.helper");
const { getJWTToken } = require("../utils/jwt.helper");

class RatingAgenciesController {
    async getAll(req, res, next) {
        let params = req.params;
        let name = params.name;
        try {
            let ratingAgencies = []
            if (name !== "all") {
                ratingAgencies = await RatingAgencies.getAllBySearch(name.toLowerCase().toUpperCase())
            } else {
                ratingAgencies = await RatingAgencies.getAll()
            }
            return res.status(httpStatus.OK).json(new APIResponse(ratingAgencies, 'Rating agencies fetch successfully.', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error in fetching rating agencies', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }
    async create(req, res, next) {
        let body = req.body;
        const model = new RatingAgencies(body);

        try {
            const saveResponse = await model.save();
            return res.status(httpStatus.OK).json(new APIResponse(saveResponse, 'Rating agencies created successfully.', httpStatus.OK));

        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error adding rating agencies', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    async edit(req, res, next) {
        let params = req.params;
        let body = req.body;
        let id = params.id;

        try {
            const updatedData = await RatingAgencies.updateRatingAgency(body,id)
            return res.status(httpStatus.OK).json(new APIResponse(updatedData, 'Rating agencies updated successfully.', httpStatus.OK));

        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error updating rating agencies', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    async getById(req, res, next) {
        let params = req.params;
        let id = params.id;
        try {
            const Data = await RatingAgencies.getById(id)
            return res.status(httpStatus.OK).json(new APIResponse(Data, 'Rating agencies fetch successfully.', httpStatus.OK));

        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error in fetching rating agencies', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    async delete(req, res, next) {
        let params = req.params;
        let id = params.id;
        try {
            const existingData = await RatingAgencies.getById(id)
            if (!existingData) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Can not found rating agencies.', httpStatus.OK));
            } else {
                const Data = await RatingAgencies.deleteRatingAgency(id)
                return res.status(httpStatus.OK).json(new APIResponse({}, 'Rating agencies deleted successfully.', httpStatus.OK));
            }
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error in deleting rating agencies', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }
}

var exports = (module.exports = new RatingAgenciesController());