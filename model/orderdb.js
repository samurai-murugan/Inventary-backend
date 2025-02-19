const client = require('../dbconfig');

const checkOrderExist = async (product,userid) => {
    // const query = 'SELECT * FROM orders WHERE product = $1 AND address = $2';
    const query = 'SELECT * FROM orders WHERE product = $1 AND userid = $2';
    const result = await client.query(query, [product, userid]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

const createOrder = async (orderid, product, quantity, price, address, paymentMethod, created_date, modified_date,userid) => {
  console.log("order_id",orderid)
  
    const query = `
        INSERT INTO orders (orderid,product, quantity, price, address, paymentmethod, created_date, modified_date,userid )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9)
        RETURNING orderid, product, quantity, price, address, paymentmethod,userid;
    `;
    const result = await client.query(query, [orderid,product, quantity, price, address, paymentMethod, created_date, modified_date,userid]);
    return result.rows[0];
};

const getAllOrders = async () => {
    // const query = 'SELECT * FROM orders';
    // const query = 'SELECT orders.orderid, orders.product, orders.quantity, orders.price, orders.address, orders.paymentmethod, orders.userid, users.firstname FROM orders JOIN users ON orders.userid = users.id';
    const query = `SELECT orders.orderid, orders.product, orders.quantity, orders.price, orders.address, orders.paymentmethod, orders.userid, CONCAT(users.firstname, ' ', users.lastname) AS username ,orders.created_date FROM orders JOIN users ON orders.userid = users.id ORDER by orders.modified_date DESC`;
    const result = await client.query(query);
    return result.rows;
};
const getAllUserOrders = async (userid) => {
    const query = 'SELECT * FROM orders WHERE userid=$1 ORDER by modified_date DESC';
    const result = await client.query(query,[userid]);
    return result.rows;
};




const updateOrder = async (orderid, updateData) => {
    console.log(updateData.price,"working in update")
    const { product, quantity, price,address, modified_date } = updateData;
    const result = await client.query(
        'UPDATE orders SET product = $1, quantity = $2, price = $3,address=$4, modified_date = $5 WHERE orderid = $6 RETURNING *',
        [product, quantity, price, address,modified_date, orderid]
    );
    return result.rows[0];
};


const deleteOrder = async (orderid) => {
    try {


        console.log("deleting",orderid)
        const orderItemsQuery = `
            SELECT product, quantity FROM orders WHERE orderid = $1
        `;
        const res = await client.query(orderItemsQuery, [orderid]);

        for (const item of res.rows) {
            const updateProductQuery = `
                   UPDATE products
                   SET quantity = (quantity::INTEGER + $1)
                   WHERE productname = $2
            `;
            await client.query(updateProductQuery, [item.quantity, item.product]);
        }

        const deleteOrderQuery = 'DELETE FROM orders WHERE orderid = $1';
        await client.query(deleteOrderQuery, [orderid]);

        console.log(`Order with ID ${orderid} and related products have been updated and deleted.`);
    } catch (error) {
        console.error('Error deleting order:', error);
    }
};


module.exports = {
    checkOrderExist,
    createOrder,
    getAllOrders,
    updateOrder,
    deleteOrder,
    getAllUserOrders
};
