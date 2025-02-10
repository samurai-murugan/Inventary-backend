const express = require('express');
const { getProducts,getAdminProducts } = require('../controller/cardsController');  // Import the controller
const router = express.Router();

// Define the route for fetching products
router.get('/cardsData', getProducts);
router.get('/adminpageCardData', getAdminProducts);

module.exports = router;
