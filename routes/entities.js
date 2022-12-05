"use strict";

var router = require("express").Router();

const httpStatus = require("http-status");
const Joi = require("joi");
const APIResponse = require("../helpers/APIResponse");
const entitiesController = require("../controllers/entities");
const { decodeToken } = require("../utils/jwt.helper");

const loginValidation = Joi.object({
    user_name: Joi.string().trim().error(new Error('Please enter Email/Mobile')),
    password: Joi.string().error(new Error('Please enter password'))
});

router.post('/login', loginValidate, entitiesController.login);
router.get('/get-roles', Validate, entitiesController.getRoles);
router.get('/get-warehouses/:id', Validate, entitiesController.getWarehouses);
router.get('/get-sectors', Validate, entitiesController.getSectors);
router.post('/add-role', Validate, entitiesController.addRole);
router.post('/add', Validate, entitiesController.create);
router.post('/edit/:id', Validate, entitiesController.edit);
router.delete('/remove/:id', Validate, entitiesController.delete);
router.get('/get/:id', Validate, entitiesController.getAll);
router.get('/getById/:id', Validate, entitiesController.getById);
router.get('/getRatingAgenciesById/:id', Validate, entitiesController.getRatingAgenciesById);

function loginValidate(req, res, next) {
    const Data = req.body;
    const { error, value } = loginValidation.validate(Data);
    if (error) {
        return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
    } else {
        return next();
    }
}

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


module.exports = router;    