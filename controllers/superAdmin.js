"use strict";

const superAdmin = require("../models/superAdmin");
const httpStatus = require('http-status');
const APIResponse = require("../helpers/APIResponse");
const { hashPassword, comparePassword } = require("../utils/bcrypt.helper");
const { getJWTToken } = require("../utils/jwt.helper");

class superAdminController {

    async login(req, res, next) {
        try {
            const userLogin = req.body.user_name.toLowerCase()
            const admin = await superAdmin.getAdminByEmail(userLogin)
            if (admin) {
                const match = await comparePassword(req.body.password, admin.password)
                if (match) {
                    const token = getJWTToken({
                        id: admin.id,
                        email: req.body.email,
                        role:"superAdmin"
                    });

                    let newAdmin;
                    newAdmin = {
                        id: admin.id,
                        email: admin.email,
                        name: admin.name,
                        token: token
                    };

                    return res
                        .status(httpStatus.OK)
                        .json(
                            new APIResponse(newAdmin, "Login successfully", httpStatus.OK)
                        );
                }
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(
                            null,
                            "Wrong Password",
                            httpStatus.OK,
                            "Wrong Password"
                        )
                    );
            }

            return res.status(httpStatus.OK).json(new APIResponse(superAdmin, 'Wrong email', httpStatus.OK));
        }
        catch (e) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "Somethig went wrong" });
        }
    }
}

var exports = (module.exports = new superAdminController());