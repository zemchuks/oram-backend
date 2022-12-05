"use strict"
const dotenv = require('dotenv')
const airBases = require('./airBase.json')
const airBase = require("../models/airBase");
const country = require("../models/countries");

dotenv.config()
var mongoose = require('mongoose')
mongoose.connect(`${process.env.DB_CONNECTION_CLUSTER}`, { useUnifiedTopology: false })
function connect() {
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log(`Database connected successfully`);
    });
};
connect()

const addAirBase = async () => {
    const countries = await country.getAll()
    airBases.map(item => {
        let data = {
            ...item,
            countryId: countries.find(countryItem => countryItem.name === item.country)?._id
        }
        if (data.countryId) {
            const model = new airBase(data);
            model.save(data)
        }
    })
}

addAirBase()