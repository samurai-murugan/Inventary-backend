const client = require('../dbconfig');

const checkOrderExist = async (product,userid) => {
    // const query = 'SELECT * FROM orders WHERE product = $1 AND address = $2';
    const query = 'SELECT * FROM orders WHERE product = $1 AND userid = $2';
    const result = await client.query(query, [product, userid]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

const createOrder = async (orderid, product, quantity, price, address, paymentMethod, created_date, modified_date,userid) => {
    const query = `
        INSERT INTO orders (orderid,product, quantity, price, address, paymentmethod, created_date, modified_date,userid )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9)
        RETURNING orderid, product, quantity, price, address, paymentmethod,userid;
    `;
    const result = await client.query(query, [orderid,product, quantity, price, address, paymentMethod, created_date, modified_date,userid]);
    return result.rows[0];
};

const getAllOrders = async () => {
    const query = 'SELECT * FROM orders';
    const result = await client.query(query);
    return result.rows;
};
const getAllUserOrders = async (userid) => {
    const query = 'SELECT * FROM orders WHERE userid=$1';
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
    const query = 'DELETE FROM orders WHERE orderid = $1';
    await client.query(query, [orderid]);
};

module.exports = {
    checkOrderExist,
    createOrder,
    getAllOrders,
    updateOrder,
    deleteOrder,
    getAllUserOrders
};
