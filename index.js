const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
var database = require("./database/database");
const cors = require('cors');
const port = process.env.PORT || 5002

app.use(cors())
app.use(express.json({ limit: '50mb' }))

app.all("*", function (req, res, next) {
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type,Authorization ,Accept"
    );
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Expose-Headers", "Authorization");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type, Authorization"
    );
    next();
});

function setupRoutes() {
    const routes = require("./routes/index")
    routes.setup(app)
}

setupRoutes()

app.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
});
