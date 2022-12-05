"use strict";


const transaction = require("../models/transaction/transaction");
const transactionDetails = require("../models/transaction/transactionDetails");
const transactionKeyParties = require("../models/transaction/transactionKeyParties");
const transactionDocumentFlow = require("../models/transaction/transactionDocumentFlow");
const transactionFundFlow = require("../models/transaction/transactionFundFlow");
const transactionFacility = require("../models/transaction/transactionFacility");
const user = require("../models/user");
const superAdmin = require("../models/superAdmin");
const httpStatus = require('http-status');
const APIResponse = require("../helpers/APIResponse");
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const makeTermSheet = require("../utils/makeTermSheet");


class transactionController {

    async getPorts(req, res, next) {

    }

    async create(req, res, next) {
        let body = req.body;
        let detail = req.body.detail;
        let keyParties = req.body.keyParties;
        let documentFlow = req.body.documentFlow;
        let fundFlow = req.body.fundFlow;
        let facility = req.body.facility;

        let updateData = {}
        const newTransaction = {
            type: body.type,
            userId: body.userId,
            lenders: body.lenders,
            borrower_Applicant: body.borrower_Applicant,
        }
        try {
            const model = new transaction(newTransaction);
            const saveResponse = await model.save();
            if (detail) {

                if (detail.pricingDetails.pricingHedgingStatus) {
                    detail = {
                        ...detail,
                        transactionId: saveResponse._id
                    }
                } else {
                    delete detail.pricingDetails.pricingCounterParty
                    detail = {
                        ...detail,
                        transactionId: saveResponse._id
                    }
                }
                const transactionDetailsModel = new transactionDetails(detail);
                const transactionDetailsResponse = await transactionDetailsModel.save();
                updateData = {
                    ...updateData,
                    details: transactionDetailsResponse._id
                }
            }
            if (keyParties.length) {
                let keyParty = []
                for (let i = 0; i < keyParties.length; i++) {
                    let element = keyParties[i];
                    keyParty.push(element)
                }
                let element = {
                    parties: keyParty,
                    transactionId: saveResponse._id
                }
                const transactionKeyPartiesModel = new transactionKeyParties(element);
                const transactionKeyPartiesResponse = await transactionKeyPartiesModel.save();

                updateData = {
                    ...updateData,
                    keyParties: transactionKeyPartiesResponse._id
                }
            }
            if (documentFlow) {

                documentFlow = {
                    ...documentFlow,
                    transactionId: saveResponse._id
                }
                const transactionDocumentFlowModel = new transactionDocumentFlow(documentFlow);
                const transactionDocumentFlowResponse = await transactionDocumentFlowModel.save();
                updateData = {
                    ...updateData,
                    documentFlow: transactionDocumentFlowResponse._id
                }
            }
            if (fundFlow) {
                if (fundFlow.additonalCharges) {
                    fundFlow = {
                        ...fundFlow,
                        transactionId: saveResponse._id
                    }
                } else {
                    delete fundFlow.payer
                    fundFlow = {
                        ...fundFlow,
                        transactionId: saveResponse._id
                    }
                }

                const transactionFundFlowModel = new transactionFundFlow(fundFlow);
                const transactionFundFlowResponse = await transactionFundFlowModel.save();
                updateData = {
                    ...updateData,
                    fundFlow: transactionFundFlowResponse._id
                }
            }
            if (facility) {

                facility = {
                    ...facility,
                    transactionId: saveResponse._id
                }
                const transactionFacilityModel = new transactionFacility(facility);
                const transactionFacilityResponse = await transactionFacilityModel.save();
                updateData = {
                    ...updateData,
                    facility: transactionFacilityResponse._id
                }
            }

            const Transaction = await transaction.updateTransaction(updateData, saveResponse._id)
            if (Transaction) {
                return res.status(httpStatus.OK).json(new APIResponse(Transaction, 'Transaction added successfully.', httpStatus.OK));
            } else {
                await transaction.deleteTransaction(saveResponse._id)
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error adding transaction', httpStatus.INTERNAL_SERVER_ERROR, e));
            }

        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error adding transaction', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    async edit(req, res, next) {
        let body = req.body;
        let id = req.params.id;
        let userId = req.params.userId;
        let detail = req.body.detail;
        let keyParties = req.body.keyParties;
        let documentFlow = req.body.documentFlow;
        let fundFlow = req.body.fundFlow;
        let facility = req.body.facility;

        let updateData = {
            lenders: body.lenders,
            borrower_Applicant: body.borrower_Applicant,
        }
        try {
            const alreadyExist = await transaction.getById(id);
            if (!alreadyExist) {
                return res.status(httpStatus.OK).json(new APIResponse({}, 'Transaction not found', httpStatus.OK));
            } else {
                if (detail) {

                    const transactionDetailsResponse = await transactionDetails.updateTransactionDetail(detail, detail._id);

                    updateData = {
                        ...updateData,
                        details: transactionDetailsResponse._id
                    }
                }
                if (keyParties && keyParties.keyParties.length) {
                    let keyParty = []
                    for (let i = 0; i < keyParties.keyParties.length; i++) {
                        let element = keyParties.keyParties[i];
                        keyParty.push(element)
                    }
                    let element = {
                        parties: keyParty,
                    }
                    const transactionKeyPartiesResponse = await transactionKeyParties.updateTransactionKeyParties(element, keyParties._id);

                    updateData = {
                        ...updateData,
                        keyParties: transactionKeyPartiesResponse._id
                    }
                }
                if (documentFlow) {
                    const transactionDocumentFlowResponse = await transactionDocumentFlow.updateTransactionDocumentFlow(documentFlow, documentFlow._id);
                    updateData = {
                        ...updateData,
                        documentFlow: transactionDocumentFlowResponse._id
                    }
                }
                if (fundFlow) {
                    const transactionFundFlowResponse = await transactionFundFlow.updateTransactionFundFlow(fundFlow, fundFlow._id);
                    updateData = {
                        ...updateData,
                        fundFlow: transactionFundFlowResponse._id
                    }

                }
                if (facility) {
                    if (facility._id) {
                        const transactionFacilityResponse = await transactionFacility.updateTransactionFacility(facility, facility._id);
                        updateData = {
                            ...updateData,
                            facility: transactionFacilityResponse._id
                        }
                    } else {
                        delete facility._id
                        facility = {
                            ...facility,
                            transactionId: id
                        }
                        const transactionFacilityModel = new transactionFacility(facility);
                        const transactionFacilityResponse = await transactionFacilityModel.save();
                        updateData = {
                            ...updateData,
                            facility: transactionFacilityResponse._id
                        }
                    }
                }
                updateData = {
                    ...updateData,
                    lenders: body.lenders,
                    borrower_Applicant: body.borrower_Applicant,
                }
                const updatedTransaction = await transaction.updateTransaction(updateData, alreadyExist._id)
                return res.status(httpStatus.OK).json(new APIResponse(updatedTransaction, 'Transaction updated successfully.', httpStatus.OK));
            }
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error updating transaction', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    async getAll(req, res, next) {
        let userId = req.params.userId
        try {
            let transactions = []
            if (userId === "all") {
                transactions = await transaction.getAll()
            } else {
                transactions = await transaction.getByUserId(userId)
            }
            return res.status(httpStatus.OK).json(new APIResponse(transactions, 'Transactions fetch successfully.', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error in fetching transactions', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }
    async getById(req, res, next) {
        let userId = req.params.userId
        let id = req.params.id
        try {
            let Transaction = await transaction.getById(id);
            if (Transaction) {
                return res.status(httpStatus.OK).json(new APIResponse(Transaction, 'Transaction fetch successfully.', httpStatus.OK));
            } else {
                return res.status(httpStatus.OK).json(new APIResponse(Transaction, 'Transaction not found.', httpStatus.OK));
            }
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error in fetching transaction', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }
    async download(req, res, next) {
        try {
            let id = req.params.id
            let data
            const finedTransaction = await transaction.getById(id)
            if (finedTransaction && finedTransaction.termSheetURL) {
                data = finedTransaction.termSheetURL
                return res.status(httpStatus.OK).json(new APIResponse({ data: data }, 'TermSheet downloaded successfully.', httpStatus.OK));
            } else {
                // const User = await user.getById(finedTransaction.userId)
                // const SuperAdmin = await superAdmin.getById(finedTransaction.userId)
                // const financer = User.name ?? SuperAdmin.name
                let doc = new PDFDocument({ bufferPages: true });
                let buffers = [];
                doc.on('data', buffers.push.bind(buffers));
                makeTermSheet(doc, finedTransaction)
                // makeTermSheet(doc, finedTransaction,financer)
                doc.on('end', async () => {
                    let pdfData = Buffer.concat(buffers);
                    const filePath = `files/TermSheet-${id}.pdf`
                    fs.writeFile(filePath, pdfData, async function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            try {
                                console.log("File Created")
                                data = fs.readFileSync(path.join(__dirname, `../files/TermSheet-${id}.pdf`), 'base64', function (err, content) {
                                    return content;
                                });
                                return res.status(httpStatus.OK).json(new APIResponse({ data: data }, 'TermSheet downloaded successfully.', httpStatus.OK));
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    });
                });

            }
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error in downloading TermSheet', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }
    async uploadTermSheet(req, res, next) {
        try {
            let body = req.body
            let id = body._id
            const updateTransaction = await transaction.updateTransaction({ termSheet: "Signed", termSheetURL: body.termSheetUrl }, id)
            const updatedTransaction = await transaction.getById(id)
            // const data = fs.readFileSync(path.join(__dirname, '../files/TermSheet.docx'), 'base64', function (err, content) {
            //     return content;
            // });
            return res.status(httpStatus.OK).json(new APIResponse(updatedTransaction, 'TermSheet uploaded successfully.', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error in uploading TermSheet', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }
}
var exports = (module.exports = new transactionController());