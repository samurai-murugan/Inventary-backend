
const express = require('express');
const router = express.Router();
 
const{addProducts,deleteProductById,getAllProductsController,updateProductHandler} = require('../controller/productController')


router.post('/addProduct', addProducts);
router.delete('/deleteProduct/:productid', deleteProductById);
router.get('/allproducts', getAllProductsController);
router.put('/updateproduct/:productid', updateProductHandler);

module.exports = router;