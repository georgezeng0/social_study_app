const { auth } = require('express-oauth2-jwt-bearer');

if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}

module.exports.jwtCheck = auth({
  audience: process.env.AUTH0_API_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_AUTH0_ISSUER
});