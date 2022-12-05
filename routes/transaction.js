"use strict";

var router = require("express").Router();

const httpStatus = require("http-status");
const Joi = require("joi");
const APIResponse = require("../helpers/APIResponse");
const transactionController = require("../controllers/transaction");
const { decodeToken } = require("../utils/jwt.helper");

router.get('/get-ports', Validate, transactionController.getPorts);
router.get('/get/:userId', Validate, transactionController.getAll);
router.get('/getById/:id', Validate, transactionController.getById);
router.post('/add', Validate, transactionController.create);
router.post('/edit/:id', Validate, transactionController.edit);
router.get('/termSheet/:id',Validate, transactionController.download);
router.post('/uploadTermSheet',Validate, transactionController.uploadTermSheet);



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