const express = require('express');
const router = express.Router();
    const { getAllProducts,getAllProductsQunaityAndPrice,getOrderDetail,getAllProductsQunaityforEveryHour } = require('../controller/chartController'); // Import the controller

// Define route for getting all products
router.get('/products', getAllProducts);
router.get('/quantity', getAllProductsQunaityAndPrice);
router.get('/OrderDetails', getOrderDetail);
router.get('/everyHour', getAllProductsQunaityforEveryHour);


module.exports = router;