const client = require('../dbconfig')


const getProductsFromOrders = async () => {
  // try {
  //   const query = 'SELECT orderid, product, price FROM orders'; 
  //   const result = await client.query(query);
  //   return result.rows; 
  // } catch (error) {
  //   console.error('Error fetching products:', error);
  //   throw error;  
  // }

  try {
    const query = 'SELECT orderid, product, price, quantity, (price * quantity) AS total FROM orders';
    const result = await client.query(query);
    return result.rows; 
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;  
  }
};

const getadminProductsFromOrders = async () => {
  try {
    const query = `
      SELECT 
        product, 
        SUM(quantity) AS totalquantity, 
        SUM(price) AS totalprice
      FROM orders
      GROUP BY product;
    `;
    const result = await client.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};




module.exports = {
  getProductsFromOrders,
  getadminProductsFromOrders
};
