const paypal = require('@paypal/checkout-server-sdk');

// This assumes you have these environment variables set
const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

// Creating an environment
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
// Use LiveEnvironment for production
// let environment = new paypal.core.LiveEnvironment(clientId, clientSecret);

let client = new paypal.core.PayPalHttpClient(environment);

module.exports = client;