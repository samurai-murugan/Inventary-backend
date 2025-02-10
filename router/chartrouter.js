const express = require('express');
const router = express.Router();
    const { getAllProducts,getAllProductsQunaityAndPrice } = require('../controller/chartController'); // Import the controller

// Define route for getting all products
router.get('/products', getAllProducts);
router.get('/quantity', getAllProductsQunaityAndPrice);


module.exports = router;