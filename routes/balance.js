


const express = require("express");
let router = express.Router();
// const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`); 
const User = require('../models/users');
const {charge} = require('../controllers/balance')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/charge',charge)


router.post('/withdraw',  async (req, res) => {
    console.log(req.body);
    try {
      const { amount, method, userid } = req.body;
      const user = await User.findById(userid);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.totalBalance < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
  
      // Process withdrawal (this is where you'd integrate with your payment provider)
      // For now, we'll just update the user's balance
      user.totalBalance -= amount;
      await user.save();
  
      // In a real-world scenario, you'd initiate the transfer here
  
      res.json({ message: 'Withdrawal processed successfully', newBalance: user.totalBalance });
    } catch (error) {
      console.error('Withdrawal error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

  router.post('/create-connect-account', async (req, res) => {
    try {

      
      const body = req.body
      
      console.log(body.userid);

      const user = await User.findById(body.userid);

  console.log(user);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.stripeConnectedAccountId) {
        return res.status(400).json({ message: 'Stripe account already exists' });
      }
  
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US', // or the appropriate country code
        email: user.email,
        capabilities: {
          transfers: {requested: true},
        },
      });
  
      user.stripeConnectedAccountId = account.id;
      await user.save();
  
      // Generate an account link for the user to complete onboarding
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${process.env.FRONTEND_URL}/stripe-connect-refresh`,
        return_url: `${process.env.FRONTEND_URL}/stripe-connect-return`,
        type: 'account_onboarding',
      });

      res.json({ url: accountLink.url });
    } catch (error) {
      console.error('Error creating Connect account:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });



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