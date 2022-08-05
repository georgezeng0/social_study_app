// index.js

/**
 * Required modules
 */
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const path = require('path')

/**
 * App variables
 */

const PORT = process.env.PORT || 5000;

/**
 * App Configuration
 */

const app = express()

/**
 * Routes Definitions
 */

app.get("/api", (req, res) => {
    res.send({message: "Server Responding!!"})
})

/**
 * Server Activation
 */

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
})