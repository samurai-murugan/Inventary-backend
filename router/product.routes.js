
const express = require('express');
const router = express.Router();
 
const{addProducts,deleteProductById,getAllProductsController,updateProductHandler,getProductPrices,getProducts,getProductQuanatityAndProduct} = require('../controller/productController')


router.post('/addProduct', addProducts);
router.delete('/deleteProduct/:productid', deleteProductById);
router.get('/allproducts', getAllProductsController);
router.put('/updateproduct/:productid', updateProductHandler);
router.get('/product-prices', getProductPrices);
router.get('/productsName', getProducts);
router.get('/QuantityAndName/:productname', getProductQuanatityAndProduct);

module.exports = router;