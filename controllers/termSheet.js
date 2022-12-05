"use strict";

const port = require("../models/port");
const httpStatus = require('http-status');
const fs = require('fs');
const APIResponse = require("../helpers/APIResponse");
class TermSheetController {
    async download(req, res, next) {
        try {
            const file = fs.access("../files/TermSheet.docx")
           console.log(file);
            return res.status(httpStatus.OK).json(new APIResponse({}, 'Ports fetch successfully.', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error in fetching Ports', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

}
var exports = (module.exports = new TermSheetController());