const express = require('express');
const router = express.Router();
const { addOrder, deleteOrderById, getAllOrdersController, updateOrderHandler,getAllUserOrdersController } = require('../controller/orderController'); // assuming the controller file is `orderController.js`

// http://localhost:5000/orders/addOrder
router.post('/addOrder', addOrder);

// http://localhost:5000/orders/deleteorder/O-0000A0002
router.delete('/deleteorder/:orderid', deleteOrderById);

// http://localhost:5000/orders/allOrders
router.get('/allOrders', getAllOrdersController);

// http://localhost:5000/orders/allUserOrders
router.get('/allUserOrders/:userid', getAllUserOrdersController);

router.put('/updateOrder/:orderid', updateOrderHandler);

module.exports = router;
