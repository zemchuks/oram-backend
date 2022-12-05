"use strict";

var router = require("express").Router();

const httpStatus = require("http-status");
const Joi = require("joi");
const APIResponse = require("../helpers/APIResponse");
const productController = require("../controllers/product");
const { decodeToken } = require("../utils/jwt.helper");

const createValidation = Joi.object({
    name: Joi.string().error(new Error('Please enter valid name')),
    nature: Joi.string().error(new Error('Please enter valid nature')),
    unit: Joi.string().error(new Error('Please enter valid unit')),
    family: Joi.string().error(new Error('Please enter valid family')),
    category: Joi.string().error(new Error('Please enter valid category')),
    type: Joi.string().error(new Error('Please enter valid type')),
    matric: Joi.string().error(new Error('Please enter valid matric')),
    status: Joi.string().error(new Error('Please enter valid status')),
    expiryDate: Joi.string().error(new Error('Please enter valid expiry Date')),
});

const editValidation = Joi.object({
    name: Joi.string().error(new Error('Please enter valid name')),
    nature: Joi.string().error(new Error('Please enter valid nature')),
    unit: Joi.string().error(new Error('Please enter valid unit')),
    family: Joi.string().error(new Error('Please enter valid family')),
    category: Joi.string().error(new Error('Please enter valid category')),
    type: Joi.string().error(new Error('Please enter valid type')),
    matric: Joi.string().error(new Error('Please enter valid matric')),
    status: Joi.string().error(new Error('Please enter valid status')),
    isApproved: Joi.boolean().error(new Error('isApproved must be boolean')),
    expiryDate: Joi.string().error(new Error('Please enter valid expiry Date')),
});

router.post('/add', createValidate, productController.create);
router.post('/edit/:id', editValidate, productController.edit);
router.delete('/remove/:id', Validate, productController.delete);
router.get('/get/:name', Validate, productController.getAll);
router.get('/getById/:id', Validate , productController.getById);

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