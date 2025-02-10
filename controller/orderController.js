const { checkOrderExist, createOrder, deleteOrder, getAllOrders, updateOrder } = require('../model/orderdb');
const client = require('../dbconfig');
const moment = require('moment');

const generateNewOrderId = async (lastGeneratedId) => {
    const regex = /^O-(\d{4})([A-Z])(\d{4})$/; 
    const match = lastGeneratedId.match(regex);

    if (!match) {
        throw new Error("Invalid ID format.");
    }

    const year = match[1];
    let letter = match[2];
    let number = parseInt(match[3]);

    number++;

    if (number > 9999) {
        number = 1;
        if (letter === 'Z') {
            const newYear = (parseInt(year) + 1).toString();
            return `O-${newYear}A0001`; 
        } else {
            letter = String.fromCharCode(letter.charCodeAt(0) + 1); 
        }
    }

    const paddedNumber = number.toString().padStart(4, '0');
    const newId = `O-${year}${letter}${paddedNumber}`;

    const existingIdCheck = await client.query('SELECT orderid FROM orders WHERE orderid = $1', [newId]);
    if (existingIdCheck.rows.length > 0) {
        return generateNewOrderId(newId); 
    }

    return newId;
};

// Add a new Order
const addOrder = async (req, res) => {
    const { product, quantity, address, paymentMethod ,userId} = req.body;
    console.log(userId, "user id")
    console.log(product, quantity, address, paymentMethod ,userId, "user id")
    const userid = userId;
    if (!product || typeof product !== 'string') {
        return res.status(400).json({
            message: 'Product is required and must be a valid string.',
        });
    }

    if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({
            message: 'Quantity must be a positive number.',
        });
    }

    if (!address || typeof address !== 'string') {
        return res.status(400).json({
            message: 'Address is required and must be a valid string.',
        });
    }

    if (!paymentMethod || typeof paymentMethod !== 'string') {
        return res.status(400).json({
            message: 'Payment method is required and must be a valid string.',
        });
    }

    try {
        // Check if the product exists in the product table
        const productQuery = await client.query('SELECT price FROM products WHERE productname = $1', [product]);

        if (productQuery.rows.length === 0) {
            return res.status(404).json({
                message: 'Product not found.',
            });
        }

        let price = productQuery.rows[0].price; 
           price = price * quantity;
        const existingOrder = await checkOrderExist(product,userId);
        if (existingOrder) {
            return res.status(400).json({ message: 'Order with this product and userid already exists.' });
        }

        const originalDate = new Date();
        const created_date = moment(originalDate).format('YYYY-MM-DD HH:mm');
        const modified_date = moment(originalDate).format('YYYY-MM-DD HH:mm');

        const lastOrder = await client.query('SELECT orderid FROM orders ORDER BY created_date DESC LIMIT 1');
        const lastGeneratedId = lastOrder.rows.length > 0 ? lastOrder.rows[0].orderid : 'O-0000A0001'; // Default ID if no order exists
    
        const orderid = await generateNewOrderId(lastGeneratedId);

        const newOrder = await createOrder(orderid, product, quantity, price, address, paymentMethod, created_date, modified_date,userid,userid);
     console.log(newOrder.userid)
        return res.status(201).json({
            message: 'Order created successfully',
            newOrder: {
                orderid: newOrder.orderid,
                userid:newOrder.userid,
                product: newOrder.product,
                quantity: newOrder.quantity,
                price: newOrder.price,
                address: newOrder.address,
                paymentMethod: newOrder.paymentMethod,
            },
        });

    } catch (error) {
        console.error('Error adding order:', error);
        return res.status(500).json({ message: 'Error adding order', error: error.message });
    }
};

// Delete order by ID
const deleteOrderById = async (req, res) => {
    const { orderid } = req.params; 
  console.log("delete", orderid)
    if (!orderid) {
        return res.status(400).json({
            message: 'Order ID is required.',
        });
    }

    try {
        const orderExists = await client.query('SELECT * FROM orders WHERE orderid = $1', [orderid]);

        if (orderExists.rows.length === 0) {
            return res.status(404).json({
                message: 'Order not found.',
            });
        }

        await deleteOrder(orderid);

        return res.status(200).json({
            message: 'Order deleted successfully.',
        });
    } catch (error) {
        console.error('Error deleting order:', error);
        return res.status(500).json({
            message: 'Error deleting order',
            error: error.message,
        });
    }
};

// Get all orders
const getAllOrdersController = async (req, res) => {
    console.log("getting orders data")
    try {
        const orders = await getAllOrders();
        
        if (orders.length === 0) {
            return res.status(404).json({
                message: 'No orders found.',
            });
        }

        const orderDetails = orders.map(order => ({
            orderid: order.orderid,
            product: order.product,
            quantity: order.quantity,
            price: order.price,
            address: order.address,
            paymentMethod: order.paymentmethod,
        }));
  console.log("datas", orderDetails)
        return res.status(200).json({
            message: 'Orders fetched successfully.',
            orders: orderDetails,
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({
            message: 'Error fetching orders.',
            error: error.message,
        });
    }
};


// const { getProductsFromOrders } = require('../services/orderService'); // Adjust the path to your service layer

// Controller to fetch total quantity and total price per product
const getTotalPriceAndQuantityByProduct = async (req, res) => {
  try {
    const products = await getProductsFromOrders();
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching order data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order data',
    });
  }
};

module.exports = {
  getTotalPriceAndQuantityByProduct,
};




const updateOrderHandler = async (req, res) => {
    const { orderid } = req.params; 
    const { product, quantity, price, address, paymentMethod } = req.body;
    
    console.log("Updating order handler", address);
    if (product && typeof product !== 'string') {
        return res.status(400).json({
            message: 'Product must be a valid string.',
        });
    }

    if (quantity !== undefined && (isNaN(quantity) )) {
        return res.status(400).json({
            message: 'Quantity must be a positive number.',
        });
    }

    if (price !== undefined && (isNaN(price) )) {
        return res.status(400).json({
            message: 'Price must be a positive number.',
        });
    }

    if (address && typeof address !== 'string') {
        return res.status(400).json({
            message: 'Address must be a valid string.',
        });
    }

    if (paymentMethod && typeof paymentMethod !== 'string') {
        return res.status(400).json({
            message: 'Payment method must be a valid string.',
        });
    }

    // console.log(address)

    try {
       
        let finalPrice = price;
        if (product) {
            const productQuery = await client.query('SELECT price FROM products WHERE productname = $1', [product]);

            if (productQuery.rows.length === 0) {
                return res.status(404).json({
                    message: 'Product not found.',
                });
            }

            finalPrice = productQuery.rows[0].price; // Get the product price
        }
        finalPrice = finalPrice * quantity;

        const order = await client.query('SELECT * FROM orders WHERE orderid = $1', [orderid]);

        if (!order.rows.length) {
            return res.status(404).json({
                message: 'Order not found.',
            });
        }

        const updateData = {};
        
        if (product) updateData.product = product;
        if (quantity !== undefined) updateData.quantity = quantity;
        if (finalPrice !== undefined) updateData.price = finalPrice;
        if (address) updateData.address = address;
        if (paymentMethod) updateData.paymentMethod = paymentMethod;

        const originalDate = new Date(); 
        const modified_date = moment(originalDate).format('YYYY-MM-DD HH:mm');
        updateData.modified_date = modified_date;
         console.log(updateData)
        const updatedOrder = await updateOrder(orderid, updateData);

        return res.status(200).json({
            message: 'Order updated successfully.',
            updatedOrder: updatedOrder,
        });

    } catch (error) {
        console.error('Error updating order:', error);
        return res.status(500).json({
            message: 'Error updating order.',
            error: error.message,
        });
    }
};

module.exports = { addOrder, deleteOrderById, getAllOrdersController, updateOrderHandler };
