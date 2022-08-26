const { auth } = require('express-oauth2-jwt-bearer');
var ManagementClient = require('auth0').ManagementClient;

if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}

module.exports.jwtCheck = auth({
  audience: process.env.AUTH0_API_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_AUTH0_ISSUER
});

// Initialise auth0 class for management API interaction
// Uses info for machine to machine (MTM) application within auth0 
module.exports.auth0 = new ManagementClient({
  domain: process.env.AUTH0_MANAGEMENT_DOMAIN,
  clientId: process.env.AUTH0_MTM_CLIENTID,
  clientSecret: process.env.AUTH0_MTM_SECRET,
  scope: 'read:users update:users'
});
