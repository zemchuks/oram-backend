"use strict";

var router = require("express").Router();

const httpStatus = require("http-status");
const Joi = require("joi");
const APIResponse = require("../helpers/APIResponse");
const riskAssessmentController = require("../controllers/riskAssessment");
const { decodeToken } = require("../utils/jwt.helper");

const createValidation = Joi.object({
    transactionId: Joi.string().error(new Error('Please enter valid transactionId')),
    currencyHedge: Joi.string().error(new Error('Please enter valid currencyHedge')),
    marginFinancing: Joi.string().error(new Error('Please enter valid marginFinancing')),
    justification: Joi.string().error(new Error('Please enter valid justification')),
    internationalCreditStanding: Joi.string().error(new Error('Please enter valid internationalCreditStanding')),
    acceptableParty: Joi.string().error(new Error('Please enter valid acceptableParty')),
    creditInsurers: Joi.string().error(new Error('Please enter valid creditInsurers')),
    localCreditStanding: Joi.string().error(new Error('Please enter valid localCreditStanding')),
    goodCreditStanding: Joi.string().error(new Error('Please enter valid goodCreditStanding')),
    acceptableJurisdiction: Joi.string().error(new Error('Please enter valid acceptableJurisdiction')),
    cashCollateral: Joi.string().error(new Error('Please enter valid cashCollateral')),
    coverageOnStock: Joi.string().error(new Error('Please enter valid coverageOnStock')),
    acceptableCMA: Joi.string().error(new Error('Please enter valid acceptableCMA')),
    contractsBasis: Joi.string().error(new Error('Please enter valid contractsBasis')),
    priceHedge: Joi.string().error(new Error('Please enter valid priceHedge')),
    financingSufficiently: Joi.string().error(new Error('Please enter valid financingSufficiently')),
});

const editValidation = Joi.object({
    transactionId: Joi.string().error(new Error('Please enter valid transactionId')),
    currencyHedge: Joi.string().error(new Error('Please enter valid currencyHedge')),
    marginFinancing: Joi.string().error(new Error('Please enter valid marginFinancing')),
    justification: Joi.string().error(new Error('Please enter valid justification')),
    internationalCreditStanding: Joi.string().error(new Error('Please enter valid internationalCreditStanding')),
    acceptableParty: Joi.string().error(new Error('Please enter valid acceptableParty')),
    creditInsurers: Joi.string().error(new Error('Please enter valid creditInsurers')),
    localCreditStanding: Joi.string().error(new Error('Please enter valid localCreditStanding')),
    goodCreditStanding: Joi.string().error(new Error('Please enter valid goodCreditStanding')),
    acceptableJurisdiction: Joi.string().error(new Error('Please enter valid acceptableJurisdiction')),
    cashCollateral: Joi.string().error(new Error('Please enter valid cashCollateral')),
    coverageOnStock: Joi.string().error(new Error('Please enter valid coverageOnStock')),
    acceptableCMA: Joi.string().error(new Error('Please enter valid acceptableCMA')),
    contractsBasis: Joi.string().error(new Error('Please enter valid contractsBasis')),
    priceHedge: Joi.string().error(new Error('Please enter valid priceHedge')),
    financingSufficiently: Joi.string().error(new Error('Please enter valid financingSufficiently')),
});

router.post('/add', Validate, riskAssessmentController.create);
router.get('/getByTransactionId/:id', Validate, riskAssessmentController.getById);

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