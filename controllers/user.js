"use strict";

const User = require("../models/user");
const httpStatus = require('http-status');
const APIResponse = require("../helpers/APIResponse");
const { hashPassword, comparePassword } = require("../utils/bcrypt.helper");
const { getJWTToken, verifyToken, verifyJWTToken } = require("../utils/jwt.helper");

class UserController {

    async login(req, res, next) {
        try {
            const userLogin = req.body.user_name.toLowerCase()
            const user = await User.getUserByEmail(userLogin)
            if (user.length) {
                const match = await comparePassword(req.body.password, user[0].password)
                if (match) {
                    const token = getJWTToken({
                        id: user[0].id,
                        email: req.body.email,
                        role: "user"
                    });

                    let newUser;
                    newUser = {
                        id: user[0].id,
                        name: user[0].name,
                        email: user[0].email,
                        token: token
                    };

                    return res
                        .status(httpStatus.OK)
                        .json(
                            new APIResponse(newUser, "Login Successfully", httpStatus.OK)
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

            return res.status(httpStatus.OK).json(new APIResponse(user, 'Wrong Email', httpStatus.OK));
        }
        catch (e) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "Somethig went wrong" });
        }
    }

    async signUp(req, res, next) {
        let body = req.body;
        let newPassword = ""
        if(req.body.password) {
            newPassword = await hashPassword(req.body.password, 10);
        } else {
            newPassword = await hashPassword('', 10);
        }
        const newUser =
        {
            name: body.name,
            email: body.email.toLowerCase(),
            password: newPassword,
        }
        const model = new User(newUser);
        try {
            const alreadyExist = await User.getUserByEmail(req.body.email);
            if (!alreadyExist.length) {

                const saveResponse = await model.save();
                return res.status(httpStatus.OK).json(new APIResponse(saveResponse, 'User created successfully.', httpStatus.OK));

            } else if (alreadyExist.email === req.body.email) {
                res
                    .status(httpStatus.OK)
                    .send({ message: "email is already exist" });
            } else {
                res
                    .status(httpStatus.OK)
                    .send({ message: "Error Adding User" });
            }

        } catch (e) {
            if (e.code === 11000) {
                return res
                    .status(httpStatus.OK)
                    .send({ message: "user is already exist" });
            } else {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error Adding User', httpStatus.INTERNAL_SERVER_ERROR, e));
            }
        }
    }

    async getAllUser(req, res, next) {
        try {
            const user = await User.getAll()

            if (user) {
                return res.status(httpStatus.OK).json(new APIResponse(user, 'User get successfully.', httpStatus.OK));
            }

            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "user not found" });
        }
        catch (e) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "Somethig went wrong" });
        }
    }

    async getUserById(req, res, next) {
        try {
            const user = await User.getById(req.params.id)

            if (user) {
                return res.status(httpStatus.OK).json(new APIResponse(user, 'User get successfully.', httpStatus.OK));
            }

            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "User not found" });
        }
        catch (e) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "Somethig went wrong" });
        }
    }

    async editUser(req, res, next) {
        try {
            const alreadyExist = await User.getUserByEmail(req.body.email);
            console.log('alreadyExist', alreadyExist)
            if (alreadyExist.length) {
                if (alreadyExist[0]._id.toString() !== req.params.id) {
                    return res.status(httpStatus.OK).json(new APIResponse({}, 'Email is already exist', httpStatus.OK));
                } else {
                    const user = await User.getById(req.params.id)
                    if (user) {
                        const updatedUser = await User.updateUser(req.body, req.params.id)
                        return res.status(httpStatus.OK).json(new APIResponse(updatedUser, 'User updated successfully.', httpStatus.OK));
                    } else {
                        return res.status(httpStatus.BAD_REQUEST).send({ message: "User not found" });
                    }
                }
            } else {
                const user = await User.getById(req.params.id)
                if (user) {
                    const updatedUser = await User.updateUser(req.body, req.params.id)
                    return res.status(httpStatus.OK).json(new APIResponse(updatedUser, 'User updated successfully.', httpStatus.OK));
                } else {
                    return res.status(httpStatus.BAD_REQUEST).send({ message: "User not found" });
                }
            }

        }
        catch (e) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "Somethig went wrong" });
        }
    }

    async deleteUser(req, res, next) {
        try {
            const user = await User.getUserById(req.params.id)

            if (user) {

                await User.deleteUser(req.params.id)

                return res.status(httpStatus.OK).json(new APIResponse({}, 'User deleted successfully.', httpStatus.OK));
            }

            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "User not found" });

        }
        catch (e) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "Somethig went wrong" });
        }
    }

    async verifyUser(req, res, next) {
        try {
            const user = await User.getUserById(req.user.id)
            if (!user) {
                return res
                    .status(401)
                    .json(new APIResponse(null, "User not found", 401));
            }

            const token = getJWTToken({
                id: user.id,
                email: req.body.email
            });

            let newUser;
            newUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token
            };

            return res
                .status(httpStatus.OK)
                .json(new APIResponse(newUser, "User verified", 200));
        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(null, "User not found", httpStatus.BAD_REQUEST, error)
                );
        }
    }

    async verifyToken(req, res, next) {
        try {
            console.log('req', req.headers.authorization)
            const user = decodeToken(req.headers.authorization)
            if (!user) {
                return res
                    .status(401)
                    .json(new APIResponse(null, "invalid token", 401));
            }
            return res
                .status(httpStatus.OK)
                .json(new APIResponse(user, "Token verified", 200));
        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(null, "invalid token", httpStatus.BAD_REQUEST, error)
                );
        }
    }


}

var exports = (module.exports = new UserController());