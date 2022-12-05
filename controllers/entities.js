"use strict";

const entities = require("../models/entities/entities");
const entityDetails = require("../models/entities/entityDetails");
const entityAddress = require("../models/entities/entityAddress");
const entityFinancials = require("../models/entities/entityFinancials");
const entityLicense = require("../models/entities/entityLicense");
const entityRating = require("../models/entities/entityRating");
const entityWarehouse = require("../models/entities/entityWarehouse");
const entityRoles = require("../models/entities/entityRoles");
const entitySector = require("../models/entities/entitySector");
const httpStatus = require('http-status');
const APIResponse = require("../helpers/APIResponse");
const { hashPassword, comparePassword } = require("../utils/bcrypt.helper");
const { getJWTToken } = require("../utils/jwt.helper");

class entitiesController {

    async login(req, res, next) {
        try {
            const entityLogin = req.body.user_name.toLowerCase()
            const entity = await entities.getByEmail(entityLogin)
            if (entity) {
                const match = await comparePassword(req.body.password, entity.password)
                if (match) {
                    const token = getJWTToken({
                        id: entity._id,
                        email: entity.email,
                        role:"admin"
                    });
                    let name
                    if (entity.details.name) {
                        name = entity.details.name
                    } else if (entity.details.givenName) {
                        name = entity.details.givenName
                    } else {
                        name = null
                    }
                    let newEntity;
                    newEntity = {
                        id: entity.id,
                        email: entity.email,
                        name: name,
                        token: token
                    };

                    return res
                        .status(httpStatus.OK)
                        .json(
                            new APIResponse(newEntity, "Login successfully", httpStatus.OK)
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

            return res.status(httpStatus.OK).json(new APIResponse(user, 'Wrong email', httpStatus.OK));
        }
        catch (e) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "Somethig went wrong" });
        }
    }

    async getAll(req, res, next) {
        let id = req.params.id
        try {
            let allEntities = []
            if (id === "all") {
                allEntities = await entities.getAll()
            } else if (id === "Company" || id === "Individual") {
                allEntities = await entities.getByType(id)
            } else {
                allEntities.push(await entities.getById(id))
            }
            return res.status(httpStatus.OK).json(new APIResponse(allEntities, 'Entities fetch successfully.', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error in fetching entities', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }
    async getSectors(req, res, next) {
        try {
            const allEntitySectors = await entitySector.getAll();
            return res.status(httpStatus.OK).json(new APIResponse(allEntitySectors, 'Entity sectors fetch successfully.', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error in fetching entity sectors', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    async getRoles(req, res, next) {
        try {
            const allEntityRoles = await entityRoles.getAll();
            return res.status(httpStatus.OK).json(new APIResponse(allEntityRoles, 'Entity roles fetch successfully.', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error in fetching entity roles', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    async addRole(req, res, next) {
        let body = req.body;
        const model = new entityRoles(body);
        try {
            const alreadyExist = await entityRoles.getByName(req.body.name);
            if (!alreadyExist) {
                const saveResponse = await model.save()
                return res.status(httpStatus.OK).json(new APIResponse(saveResponse, 'Entity role created successfully.', httpStatus.OK));

            } else if (alreadyExist.roleName === req.body.roleName) {
                res
                    .status(httpStatus.OK)
                    .send({ message: "name is already exist" });
            } else {
                res
                    .status(httpStatus.OK)
                    .send({ message: "Error Adding entity role" });
            }

        } catch (e) {
            if (e.code === 11000) {
                return res
                    .status(httpStatus.OK)
                    .send({ message: "entity role is already exist with this name" });
            } else {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error adding entity role', httpStatus.INTERNAL_SERVER_ERROR, e));
            }
        }


    }

    async create(req, res, next) {
        let body = req.body;
        let detail = req.body.detail;
        let addresses = req.body.addresses;
        let financial = req.body.financial;
        let licenses = req.body.licenses;
        let ratings = req.body.ratings;
        let warehouses = req.body.warehouses;
        let roles = req.body.roles;
        let updateData = {}
        const newPassword = await hashPassword(req.body.password, 10);
        const newEntity =
        {
            email: body.email.toLowerCase(),
            password: newPassword,
            type: body.type,
        }
        try {
            const alreadyExist = await entities.getByEmail(req.body.email);
            if (!alreadyExist) {
                const model = new entities(newEntity);
                const saveResponse = await model.save();
                if (detail) {

                    detail = {
                        ...detail,
                        entityId: saveResponse._id
                    }
                    const entityDetailsModel = new entityDetails(detail);
                    const entityDetailsResponse = await entityDetailsModel.save();
                    updateData = {
                        ...updateData,
                        details: entityDetailsResponse._id
                    }
                }
                if (addresses) {
                    let addressesIds = []
                    for (let i = 0; i < addresses.length; i++) {
                        let element = addresses[i];
                        element = {
                            ...element,
                            entityId: saveResponse._id
                        }
                        const entityAddressModel = new entityAddress(element);
                        const entityAddressResponse = await entityAddressModel.save();
                        addressesIds.push(entityAddressResponse._id)
                    }


                    updateData = {
                        ...updateData,
                        addresses: addressesIds
                    }
                }
                if (financial) {

                    financial = {
                        ...financial,
                        entityId: saveResponse._id
                    }
                    const entityFinancialsModel = new entityFinancials(financial);
                    const entityFinancialsResponse = await entityFinancialsModel.save();
                    updateData = {
                        ...updateData,
                        financial: entityFinancialsResponse._id
                    }
                }
                if (licenses) {
                    let licensesIds = []
                    for (let i = 0; i < licenses.length; i++) {
                        let element = licenses[i];
                        element = {
                            ...element,
                            entityId: saveResponse._id
                        }
                        const entityLicenseModel = new entityLicense(element);
                        const entityLicenseResponse = await entityLicenseModel.save();
                        licensesIds.push(entityLicenseResponse._id)
                    }


                    updateData = {
                        ...updateData,
                        licenses: licensesIds
                    }
                }
                if (ratings) {
                    let ratingsIds = []
                    for (let i = 0; i < ratings.length; i++) {
                        let element = ratings[i];
                        element = {
                            ...element,
                            entityId: saveResponse._id
                        }
                        const entityRatingModel = new entityRating(element);
                        const entityRatingResponse = await entityRatingModel.save();
                        ratingsIds.push(entityRatingResponse._id)
                    }


                    updateData = {
                        ...updateData,
                        ratings: ratingsIds
                    }
                }
                if (warehouses) {
                    let warehousesIds = []
                    for (let i = 0; i < warehouses.length; i++) {
                        let element = warehouses[i];
                        element = {
                            ...element,
                            entityId: saveResponse._id
                        }
                        const entityWarehouseModel = new entityWarehouse(element);
                        const entityWarehouseResponse = await entityWarehouseModel.save();
                        warehousesIds.push(entityWarehouseResponse._id)
                    }


                    updateData = {
                        ...updateData,
                        warehouses: warehousesIds
                    }
                }
                if (roles) {
                    let role = []
                    for (let i = 0; i < roles.length; i++) {
                        let element = roles[i];
                        role.push({ roleId: element.roles, justification: element.justification })
                        await entities.updateEntity({ roles: role }, saveResponse._id)
                    }
                }

                const entity = await entities.updateEntity(updateData, saveResponse._id)
                if (entity) {
                    return res.status(httpStatus.OK).json(new APIResponse(entity, 'Entity created successfully.', httpStatus.OK));
                } else {
                    await entities.deleteOne(saveResponse._id)
                    res
                        .status(httpStatus.OK)
                        .send({ message: "Error Adding User" });
                }

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
                    .send({ message: "entity is already exist with this email" });
            } else {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error adding entity', httpStatus.INTERNAL_SERVER_ERROR, e));
            }
        }
    }

    async edit(req, res, next) {
        let id = req.params.id;
        let body = req.body;
        let detail = req.body.detail;
        let addresses = req.body.addresses;
        let financial = req.body.financial;
        let licenses = req.body.licenses;
        let ratings = req.body.ratings;
        let warehouses = req.body.warehouses;
        let roles = req.body.roles;
        let updateData = {}
        const newEntity =
        {
            email: body.email.toLowerCase(),
        }
        try {
            const alreadyExist = await entities.getByEmail(req.body.email);
            if (alreadyExist) {
                if (alreadyExist._id.toString() !== id) {
                    return res.status(httpStatus.OK).json(new APIResponse({}, 'Email is already exist', httpStatus.OK));
                } else {
                    const saveResponse = await entities.updateEntity(newEntity, id);
                    if (detail) {

                        detail = {
                            ...detail,
                            entityId: saveResponse._id
                        }
                        const entityDetailsResponse = await entityDetails.updateEntityDetail(detail, detail._id);
                        updateData = {
                            ...updateData,
                            details: entityDetailsResponse._id
                        }
                    }
                    if (addresses) {
                        let addressesIds = []
                        for (let i = 0; i < addresses.length; i++) {
                            let element = addresses[i];
                            element = {
                                ...element,
                                entityId: saveResponse._id
                            }
                            const entityAddressResponse = await entityAddress.updateEntityAddress(element, element._id);
                            addressesIds.push(entityAddressResponse._id)
                        }


                        updateData = {
                            ...updateData,
                            addresses: addressesIds
                        }
                    }
                    if (financial) {

                        financial = {
                            ...financial,
                            entityId: saveResponse._id
                        }
                        const entityFinancialsResponse = await entityFinancials.updateEntityFinancial(financial, financial._id);
                        updateData = {
                            ...updateData,
                            financial: entityFinancialsResponse._id
                        }
                    }
                    if (licenses) {
                        let licensesIds = []
                        for (let i = 0; i < licenses.length; i++) {
                            let element = licenses[i];
                            element = {
                                ...element,
                                entityId: saveResponse._id
                            }
                            const entityLicenseResponse = await entityLicense.updateEntityLicense(element, element._id);
                            licensesIds.push(entityLicenseResponse._id)
                        }


                        updateData = {
                            ...updateData,
                            licenses: licensesIds
                        }
                    }
                    if (ratings) {
                        let ratingsIds = []
                        for (let i = 0; i < ratings.length; i++) {
                            let element = ratings[i];
                            element = {
                                ...element,
                                entityId: saveResponse._id
                            }
                            const entityRatingResponse = await entityRating.updateEntityRating(element, element._id);
                            ratingsIds.push(entityRatingResponse._id)
                        }


                        updateData = {
                            ...updateData,
                            ratings: ratingsIds
                        }
                    }
                    if (warehouses) {
                        let warehousesIds = []
                        for (let i = 0; i < warehouses.length; i++) {
                            let element = warehouses[i];
                            element = {
                                ...element,
                                entityId: saveResponse._id
                            }
                            const entityWarehouseResponse = await entityWarehouse.updateEntityWarehouse(element, element._id);
                            warehousesIds.push(entityWarehouseResponse._id)
                        }


                        updateData = {
                            ...updateData,
                            warehouses: warehousesIds
                        }
                    }
                    if (roles) {
                        let role = []
                        for (let i = 0; i < roles.length; i++) {
                            let element = roles[i];
                            role.push({ roleId: element.roles, justification: element.justification })
                            await entities.updateEntity({ roles: role }, saveResponse._id)
                        }
                    }
                    const entity = await entities.updateEntity(updateData, saveResponse._id)
                    return res.status(httpStatus.OK).json(new APIResponse(entity, 'Entity updated successfully.', httpStatus.OK));
                }

            }

            if (alreadyExist.email === req.body.email) {
                res
                    .status(httpStatus.OK)
                    .send({ message: "email is already exist" });
            } else {
                res
                    .status(httpStatus.OK)
                    .send({ message: "Error updating User" });
            }

        } catch (e) {
            if (e.code === 11000) {
                return res
                    .status(httpStatus.OK)
                    .send({ message: "entity is already exist with this email" });
            } else {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error updating entity', httpStatus.INTERNAL_SERVER_ERROR, e));
            }
        }
    }

    async getById(req, res, next) {
        try {
            const entity = await entities.getById(req.params.id)

            if (entity) {
                return res.status(httpStatus.OK).json(new APIResponse(entity, 'Entity get successfully.', httpStatus.OK));
            }

            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "Entity not found" });
        }
        catch (e) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "Somethig went wrong" });
        }
    }

    async delete(req, res, next) {
    }

    async getRatingAgenciesById(req, res, next) {
        try {
            const ratings = await entityRating.getById(req.params.id)

            if (ratings) {
                return res.status(httpStatus.OK).json(new APIResponse(ratings, 'Rating get successfully.', httpStatus.OK));
            }

            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "Rating not found" });
        }
        catch (e) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "Somethig went wrong" });
        }
    }

    async getWarehouses(req, res, next) {
        try {
            const entityWarehouses = await entityWarehouse.getByEntityId(req.params.id)

            if (entityWarehouses.length) {
                return res.status(httpStatus.OK).json(new APIResponse(entityWarehouses, 'Entity warehouses get successfully.', httpStatus.OK));
            }

            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "Entity warehouses not found" });
        }
        catch (e) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "Somethig went wrong" });
        }
    }
}

var exports = (module.exports = new entitiesController());