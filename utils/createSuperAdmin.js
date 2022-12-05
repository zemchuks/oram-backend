"use strict"
const dotenv = require('dotenv')
const superAdmin = require("../models/superAdmin");

dotenv.config()
var mongoose = require('mongoose');
const { hashPassword } = require('./bcrypt.helper');
mongoose.connect(`${process.env.DB_CONNECTION_CLUSTER}`, { useUnifiedTopology: false })
function connect() {
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log(`Database connected successfully`);
    });
};
connect()

const createSuperAdmin = async () => {
    const newPassword = await hashPassword('oramsys@123', 10);

    let item = {
        email:"superadmin@oramys.com",
        name:'Super Admin',
        password: newPassword
    }
        const model = new superAdmin(item);
        model.save(item)
}

createSuperAdmin()