"use strict";

var router = require("express").Router();

const httpStatus = require("http-status");
const Joi = require("joi");
const APIResponse = require("../helpers/APIResponse");

const adminController = require("../controllers/superAdmin");
const { decodeToken } = require("../utils/jwt.helper");


const loginValidation = Joi.object({
    user_name: Joi.string().trim().error(new Error('Please enter Email/Mobile')),
    password: Joi.string().error(new Error('Please enter password'))
});

router.post("/login", loginValidate, adminController.login);


function loginValidate(req, res, next) {
    const Data = req.body;
    const { error, value } = loginValidation.validate(Data);
    if (error) {
        return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
    } else {
        return next();
    }
}

module.exports = router;