const express = require('express');
const { getProducts,getAdminProducts,getuserProducts ,getCartCards} = require('../controller/cardsController');  // Import the controller
const router = express.Router();

// Define the route for fetching products
router.get('/cardsData', getProducts);
router.get('/adminpageCardData', getAdminProducts);
router.get('/userData/:userid', getuserProducts);
router.get('/cartData', getCartCards);

module.exports = router;
