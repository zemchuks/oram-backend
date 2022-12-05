"use strict";

var router = require("express").Router();

const httpStatus = require("http-status");
const Joi = require("joi");
const APIResponse = require("../helpers/APIResponse");

const userController = require("../controllers/user");
const { decodeToken } = require("../utils/jwt.helper");

const createValidation = Joi.object({
    name: Joi.string().error(new Error('Please enter valid name')),
    department: Joi.string().error(new Error('Please enter valid department')),
    password: Joi.string().error(new Error('Please enter valid password')),
    email: Joi.string().trim().email().error(new Error('Please enter valid Email')),
    profile: Joi.string().error(new Error('Please enter valid Profile')),
});

const editValidation = Joi.object({
    name: Joi.string().error(new Error('Please enter valid name')),
    department: Joi.string().error(new Error('Please enter valid department')),
    email: Joi.string().trim().email().error(new Error('Please enter valid Email')),
    profile: Joi.string().error(new Error('Please enter valid Profile')),
});

const loginValidation = Joi.object({
    user_name: Joi.string().trim().error(new Error('Please enter Email/Mobile')),
    password: Joi.string().error(new Error('Please enter password'))
});

const tokenValidation = Joi.object({
    authorization: Joi.string().error(new Error('Please enter Token'))
});

router.post("/add_user", signUpValidate, userController.signUp);
router.post("/login", loginValidate, userController.login);
router.get("/validateToken", tokenValidate, userController.verifyToken);
router.get("/get", Validate, userController.getAllUser);
router.get('/getById/:id', Validate, userController.getUserById);
router.post('/edit/:id', editValidate, userController.editUser);
router.delete('/remove/:id', Validate, userController.deleteUser);

function signUpValidate(req, res, next) {
    const Data = req.body;
    const { error, value } = createValidation.validate(Data);
    if (error) {
        return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
    } else {
        return next();
    }
}

function loginValidate(req, res, next) {
    const Data = req.body;
    const { error, value } = loginValidation.validate(Data);
    if (error) {
        return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
    } else {
        return next();
    }
}

function tokenValidate(req, res, next) {
   
    const Data = req.header;
    const { error, value } = tokenValidation.validate({ authorization: Data.authorization });
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

function editValidate(req, res, next) {
    if (verifyToken(req, res, next)) {
        const Data = req.body;
        const { error, value } = editValidation.validate(Data);
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
        } else {
            return next();
        }
    }
}

module.exports = router;