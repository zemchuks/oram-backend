"use strict";

const Product = require("../models/product");
const httpStatus = require('http-status');
const APIResponse = require("../helpers/APIResponse");
const { hashPassword, comparePassword } = require("../utils/bcrypt.helper");
const { getJWTToken } = require("../utils/jwt.helper");

class ProductController {
    async getAll(req, res, next) {
        let params = req.params;
        let name = params.name;
        try {
            let products = []
            if (name !== "all") {
                products = await Product.getAllBySearch(name.toLowerCase().toUpperCase())
            } else {
                products = await Product.getAll()
            }
            return res.status(httpStatus.OK).json(new APIResponse(products, 'Products fetch successfully.', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error in fetching product', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }
    async create(req, res, next) {
        let body = req.body;
        const model = new Product(body);

        try {
            const saveResponse = await model.save();
            return res.status(httpStatus.OK).json(new APIResponse(saveResponse, 'Product created successfully.', httpStatus.OK));

        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error adding Product', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    async edit(req, res, next) {
        let params = req.params;
        let body = req.body;
        let id = params.id;

        try {
            const updatedData = await Product.updateProduct(body,id)
            return res.status(httpStatus.OK).json(new APIResponse(updatedData, 'Product updated successfully.', httpStatus.OK));

        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error updating product', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    async getById(req, res, next) {
        let params = req.params;
        let id = params.id;
        try {
            const Data = await Product.getById(id)
            return res.status(httpStatus.OK).json(new APIResponse(Data, 'Product fetch successfully.', httpStatus.OK));

        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error in fetching product', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    async delete(req, res, next) {
        let params = req.params;
        let id = params.id;
        try {
            const existingData = await Product.getById(id)
            if (!existingData) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Can not found product.', httpStatus.OK));
            } else {
                const Data = await Product.deleteProduct(id)
                return res.status(httpStatus.OK).json(new APIResponse({}, 'Product deleted successfully.', httpStatus.OK));
            }
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error in deleting product', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }
}

var exports = (module.exports = new ProductController());