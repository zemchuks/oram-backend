"use strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema
const Justification = new Schema({
    justification: { type: String, required: true, default: null }
})

const CurrencyHedge = new Schema({
    hedgingMethod: { type: String, required: true, default: null },
    counterparty: { type: Schema.Types.ObjectId, ref: 'Entity', required: true, default: null }
})

const InternationalCreditStanding = new Schema({
    type: { type: String, required: true, default: null },
    party: { type: Schema.Types.ObjectId, ref: 'Entity', required: true, default: null },
})

const Counterparties = new Schema({
    type: { type: String, required: true, default: null },
    instrument: { type: String, required: true, default: null },
    evidence: { type: String, required: true, default: null },
})

const CreditInsurers = new Schema({
    type: { type: String, required: true, default: null },
    insurer: { type: Schema.Types.ObjectId, ref: 'Entity', required: true, default: null },
    broker: { type: Schema.Types.ObjectId, ref: 'Entity', required: true, default: null },
    insuredParty: { type: Schema.Types.ObjectId, ref: 'Entity', required: true, default: null },
    reInsurer: { type: Schema.Types.ObjectId, ref: 'Entity', required: true, default: null },
    currencyOfCoverage: { type: String, required: true, default: null },
    value: { type: String, required: true, default: null },
    clauses: { type: String, required: true, default: null },
    evidence: { type: String, required: true, default: null },
    underwriter: { type: Schema.Types.ObjectId, ref: 'Entity', required: true, default: null },
})

const LocalCreditStanding = new Schema({
    applicant: { type: Schema.Types.ObjectId, ref: 'Entity', required: true, default: null },
    advisingBank: { type: Schema.Types.ObjectId, ref: 'Entity', required: true, default: null },
    beneficiary: { type: Schema.Types.ObjectId, ref: 'Entity', required: true, default: null },
    confirmingBank: { type: Schema.Types.ObjectId, ref: 'Entity', required: true, default: null },
    issuingBank: { type: Schema.Types.ObjectId, ref: 'Entity', required: true, default: null },
    negotiatingBank: { type: Schema.Types.ObjectId, ref: 'Entity', required: true, default: null },
    reimbursingBank: { type: Schema.Types.ObjectId, ref: 'Entity', required: true, default: null },
    secondBeneficiary: { type: Schema.Types.ObjectId, ref: 'Entity', required: true, default: null },
})

var Schema = new Schema({
    transactionId: { type: String, required: true, default: null },
    justification: { type: Justification, required: true, default: null },
    currencyHedge: { type: CurrencyHedge, required: true, default: null },
    marginFinancing: { type: Justification, required: true, default: null },
    financingSufficiently: { type: Justification, required: true, default: null },
    internationalCreditStanding: { type: InternationalCreditStanding, required: true, default: null },
    counterparties: { type: Counterparties, required: true, default: null },
    acceptableParty: { type: Counterparties, required: true, default: null },
    creditInsurers: { type: CreditInsurers, required: true, default: null },
    localCreditStanding: { type: LocalCreditStanding, required: true, default: null },
    goodCreditStanding: { type: InternationalCreditStanding, required: true, default: null },
    acceptableJurisdiction: { type: Justification, required: true, default: null },
    cashCollateral: { type: Counterparties, required: true, default: null },
    coverageOnStock: { type: Counterparties, required: true, default: null },
    acceptableCMA: { type: InternationalCreditStanding, required: true, default: null },
    contractsBasis: { type: Justification, required: true, default: null },
    priceHedge: { type: Justification, required: true, default: null },
}, {
    timestamps: true
})

Schema.index({ name: "text" })

Schema.statics.createRiskAssessment = async function () {
    return await this.Save()
}

Schema.statics.getAll = async function () {
    return await this.find({ isDeleted: false })
        .populate([
            {
                path: 'currencyHedge',
                populate: {
                    path: 'counterparty',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                }
            },
            {
                path: 'internationalCreditStanding',
                populate: {
                    path: 'party',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                }
            },
            {
                path: 'creditInsurers',
                populate: [
                    {
                        path: 'insurer',
                        select: ['details'],
                        populate: {
                            path: 'details',
                            select: ['name']
                        }
                    },
                    {
                        path: 'broker',
                        select: ['details'],
                        populate: {
                            path: 'details',
                            select: ['name']
                        }
                    },
                    {
                        path: 'insuredParty',
                        select: ['details'],
                        populate: {
                            path: 'details',
                            select: ['name']
                        }
                    },
                    {
                        path: 'reInsurer',
                        select: ['details'],
                        populate: {
                            path: 'details',
                            select: ['name']
                        }
                    },
                    {
                        path: 'underwriter',
                        select: ['details'],
                        populate: {
                            path: 'details',
                            select: ['name']
                        }
                    },
                ]
            },
            {
                path: 'localCreditStanding',
                populate: [
                    {
                        path: 'applicant',
                        select: ['details'],
                        populate: {
                            path: 'details',
                            select: ['name']
                        }
                    },
                    {
                        path: 'advisingBank',
                        select: ['details'],
                        populate: {
                            path: 'details',
                            select: ['name']
                        }
                    },
                    {
                        path: 'beneficiary',
                        select: ['details'],
                        populate: {
                            path: 'details',
                            select: ['name']
                        }
                    },
                    {
                        path: 'confirmingBank',
                        select: ['details'],
                        populate: {
                            path: 'details',
                            select: ['name']
                        }
                    },
                    {
                        path: 'issuingBank',
                        select: ['details'],
                        populate: {
                            path: 'details',
                            select: ['name']
                        }
                    },
                    {
                        path: 'negotiatingBank',
                        select: ['details'],
                        populate: {
                            path: 'details',
                            select: ['name']
                        }
                    },
                    {
                        path: 'reimbursingBank',
                        select: ['details'],
                        populate: {
                            path: 'details',
                            select: ['name']
                        }
                    },
                    {
                        path: 'secondBeneficiary',
                        select: ['details'],
                        populate: {
                            path: 'details',
                            select: ['name']
                        }
                    },
                ]
            },
            {
                path: 'goodCreditStanding',
                populate: {
                    path: 'party',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                }
            },
            {
                path: 'acceptableCMA',
                populate: {
                    path: 'party',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                }
            },
        ])
        .sort({ name: 1 }).exec();
}

Schema.statics.getById = async function (id) {
    return await this.findOne({ _id: id, isDeleted: false })
    .populate([
        {
            path: 'currencyHedge',
            populate: {
                path: 'counterparty',
                select: ['details'],
                populate: {
                    path: 'details',
                    select: ['name']
                }
            }
        },
        {
            path: 'internationalCreditStanding',
            populate: {
                path: 'party',
                select: ['details'],
                populate: {
                    path: 'details',
                    select: ['name']
                }
            }
        },
        {
            path: 'creditInsurers',
            populate: [
                {
                    path: 'insurer',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
                {
                    path: 'broker',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
                {
                    path: 'insuredParty',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
                {
                    path: 'reInsurer',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
                {
                    path: 'underwriter',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
            ]
        },
        {
            path: 'localCreditStanding',
            populate: [
                {
                    path: 'applicant',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
                {
                    path: 'advisingBank',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
                {
                    path: 'beneficiary',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
                {
                    path: 'confirmingBank',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
                {
                    path: 'issuingBank',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
                {
                    path: 'negotiatingBank',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
                {
                    path: 'reimbursingBank',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
                {
                    path: 'secondBeneficiary',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
            ]
        },
        {
            path: 'goodCreditStanding',
            populate: {
                path: 'party',
                select: ['details'],
                populate: {
                    path: 'details',
                    select: ['name']
                }
            }
        },
        {
            path: 'acceptableCMA',
            populate: {
                path: 'party',
                select: ['details'],
                populate: {
                    path: 'details',
                    select: ['name']
                }
            }
        },
    ]).exec();
}

Schema.statics.getByTransactionId = async function (id) {
    return await this.findOne({ transactionId: id, isDeleted: false })
    .populate([
        {
            path: 'currencyHedge',
            populate: {
                path: 'counterparty',
                select: ['details'],
                populate: {
                    path: 'details',
                    select: ['name']
                }
            }
        },
        {
            path: 'internationalCreditStanding',
            populate: {
                path: 'party',
                select: ['details'],
                populate: {
                    path: 'details',
                    select: ['name']
                }
            }
        },
        {
            path: 'creditInsurers',
            populate: [
                {
                    path: 'insurer',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
                {
                    path: 'broker',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
                {
                    path: 'insuredParty',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
                {
                    path: 'reInsurer',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
                {
                    path: 'underwriter',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
            ]
        },
        {
            path: 'localCreditStanding',
            populate: [
                {
                    path: 'applicant',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
                {
                    path: 'advisingBank',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
                {
                    path: 'beneficiary',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
                {
                    path: 'confirmingBank',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
                {
                    path: 'issuingBank',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
                {
                    path: 'negotiatingBank',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
                {
                    path: 'reimbursingBank',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
                {
                    path: 'secondBeneficiary',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
            ]
        },
        {
            path: 'goodCreditStanding',
            populate: {
                path: 'party',
                select: ['details'],
                populate: {
                    path: 'details',
                    select: ['name']
                }
            }
        },
        {
            path: 'acceptableCMA',
            populate: {
                path: 'party',
                select: ['details'],
                populate: {
                    path: 'details',
                    select: ['name']
                }
            }
        },
    ]).exec();
}

Schema.statics.updateRiskAssessment = async function (data, id) {
    return await this.findOneAndUpdate({
        _id: id
    }, {
        $set: data
    }, {
        new: true
    })
}

Schema.statics.deleteRiskAssessment = async function (id) {
    return await this.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            isDeleted: true
        }
    }, {
        new: true
    })

}

Schema.statics.getRiskAssessmentsFromArrayOfIds = async function (ids) {
    return await this.find({
        '_id': { $in: ids }
    }).select("name")

}

module.exports = mongoose.model("RiskAssessment", Schema)