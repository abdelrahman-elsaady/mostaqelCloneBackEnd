


const express = require("express");
let router = express.Router();
const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`); 
 
const {charge} = require('../controllers/balance')

router.post('/charge',charge)




module.exports = router;



// const express = require("express");
// let router = express.Router();

// const stripe = require('stripe')(`mysecret`);



// router.post('/charge', async (req, res) => {
//     console.log(req.body);
//     console.log("aboda");

//     try {

//       const { id, amount } = req.body;
  
//       const payment = await stripe.paymentIntents.create({
//         amount,
//         currency: 'USD',
//         description: 'Deposit to account',
//         payment_method: id,
//         confirm: true
//       });
  
//       res.json({
//         message: 'Payment successful',
//         success: true
//       });
//     } catch (error) {
//       console.log('Error', error);
//       res.json({
//         message: 'Payment failed',
//         success: false
//       });
//     }
//   });

//   module.exports = router;