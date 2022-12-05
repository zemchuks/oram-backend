"use strict";

var router = require("express").Router();
const airBaseController = require("../controllers/airBase");
const { decodeToken } = require("../utils/jwt.helper");

router.get('/get/:name', Validate , airBaseController.getAll);
router.post('/edit', Validate , airBaseController.edit);

function Validate(req, res, next) {
    if (verifyToken(req, res, next)) {
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

module.exports = router;    