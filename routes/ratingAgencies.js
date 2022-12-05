"use strict";

var router = require("express").Router();

const httpStatus = require("http-status");
const Joi = require("joi");
const APIResponse = require("../helpers/APIResponse");
const RatingAgenciesController = require("../controllers/ratingAgencies");
const { decodeToken } = require("../utils/jwt.helper");

const createValidation = Joi.object({
    name: Joi.string().error(new Error('Please enter valid name')),
    street: Joi.string().error(new Error('Please enter valid street')),
    addressLine2: Joi.string().error(new Error('Please enter valid addressLine2')),
    addressLine3: Joi.string().allow(''),
    city: Joi.string().error(new Error('Please enter valid city')),
    postcode: Joi.string().error(new Error('Please enter valid postcode')),
    state: Joi.string().error(new Error('Please enter valid state')),
    country: Joi.string().error(new Error('Please enter valid country')),
    ratingSchema: Joi.array().items(Joi.object({
        grade: Joi.string().error(new Error('Please enter valid Grade')),
        value: Joi.string().error(new Error('Please enter valid Value')),
        acceptable: Joi.boolean().error(new Error('Please enter valid Acceptable')),
        comments: Joi.string().error(new Error('Please enter valid Comments')),
    }))
});

const editValidation = Joi.object({
    name: Joi.string().error(new Error('Please enter valid name')),
    street: Joi.string().error(new Error('Please enter valid street')),
    addressLine2: Joi.string().error(new Error('Please enter valid addressLine2')),
    addressLine3: Joi.string().allow(''),
    city: Joi.string().error(new Error('Please enter valid city')),
    postcode: Joi.string().error(new Error('Please enter valid postcode')),
    state: Joi.string().error(new Error('Please enter valid state')),
    country: Joi.string().error(new Error('Please enter valid country')),
    ratingSchema: Joi.array().items(Joi.object({
        grade: Joi.string().error(new Error('Please enter valid Grade')),
        value: Joi.string().error(new Error('Please enter valid Value')),
        acceptable: Joi.boolean().error(new Error('Please enter valid Acceptable')),
        comments: Joi.string().error(new Error('Please enter valid Comments')),
    }))
});

router.post('/add', createValidate, RatingAgenciesController.create);
router.post('/edit/:id', editValidate, RatingAgenciesController.edit);
router.delete('/remove/:id', Validate, RatingAgenciesController.delete);
router.get('/get/:name', Validate, RatingAgenciesController.getAll);
router.get('/getById/:id', Validate, RatingAgenciesController.getById);

function verifyToken(req, res, next) {
    try {
        const bearer = req.header('Authorization');
        if (!bearer) {
            res.status(401).send(`No token given.`)
            return false
        }

        const tokens = decodeToken(bearer)
        if (!tokens || tokens.length < 2) {
            res.status(401).send(`Expect bearer token.`)
            return false
        } else {
            return true
        }
    } catch (e) {
        console.log(e)
        Sentry.captureException(e)
        return res.status(401).send(`Invalid input or token.`)
    }
}
function Validate(req, res, next) {
    if (verifyToken(req, res, next)) {
        return next();
    }
}
function createValidate(req, res, next) {
    if (verifyToken(req, res, next)) {
        let data = req.body
        const { error, value } = createValidation.validate(data);
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
        } else {
            return next();
        }
    }
}
function editValidate(req, res, next) {
    if (verifyToken(req, res, next)) {
        let data = req.body
        const { error, value } = editValidation.validate(data);
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
        } else {
            return next();
        }
    }
}

module.exports = router;    