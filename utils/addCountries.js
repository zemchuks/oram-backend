"use strict"
const dotenv = require('dotenv')
const countries = require('./countries.json')
const country = require("../models/countries");
const ports = require('./port.json')
const port = require("../models/port");
const airBases = require('./airBase.json')
const airBase = require("../models/airBase");

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

const addCountries = async () => {
    for (let i = 0; i < countries.length; i++) {
        const element = countries[i];
        const model = new country(element);
        model.save(element)

    }
   
    console.log("Done")
}

// const addPorts = async () => {
//     const countries = await country.getAll()
//     // countries.map(countryItem => {

//     ports.map(item => {
//         let data = {
//             ...item,
//             countryId: countries.find(countryItem => countryItem.name === item.country)?._id
//         }
//         console.log('data', data)
//         if (data.countryId) {
//             const model = new port(item);
//             model.save(item)
//         }
//     })
//     // })
// }

// const addAirBase = async () => {
//     airBases.map(item => {
//         const model = new airBase(item);
//         model.save(item)
//     })
// }


// // addPorts()
addCountries()