const express = require('express');
const router = express.Router();
const { addOrder, deleteOrderById, getAllOrdersController, updateOrderHandler } = require('../controller/orderController'); // assuming the controller file is `orderController.js`

// http://localhost:5000/orders/addOrder
router.post('/addOrder', addOrder);

// http://localhost:5000/orders/deleteorder/O-0000A0002
router.delete('/deleteorder/:orderid', deleteOrderById);

// http://localhost:5000/orders/allOrders
router.get('/allOrders', getAllOrdersController);

router.put('/updateOrder/:orderid', updateOrderHandler);

module.exports = router;
