

const client = require('../dbconfig'); 

const getProducts = async () => {
    try {
      
      const query = 'SELECT ProductName, Price FROM products';
      const result = await client.query(query);
      return result.rows; 
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  };
const getProductsQunaityAndPrice = async () => {
    try {
      
      const query = 'SELECT ProductName, quantity FROM products';
      const result = await client.query(query);
      return result.rows; 
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  };
const getPrdoductDetailforTimeLineCharts = async () => {
    try {
      
      // const query = 'SELECT Product, quantity, created_date FROM orders';
      // const query = 'SELECT Product, quantity, created_date FROM orders ORDER BY created_date DESC, Product ASC';
      const query = 'SELECT Product, quantity, created_date FROM orders ORDER BY created_date ASC';
      const result = await client.query(query);
      return result.rows; 
    } catch (error) { 
      console.error('Error fetching products:', error);
      throw error;
    }
  };

// const getPrdoductDetailforTimeLineCharts = async () => {
//   try {
//     // Query to get the total quantity of each product, grouped by product and hour
//     const query = `
//       SELECT 
//           Product, 
//           DATE_TRUNC('hour', created_date) AS hour, 
//           SUM(quantity) AS total_quantity
//       FROM 
//           orders
//       GROUP BY 
//           Product, hour
//       ORDER BY 
//           Product, hour;
//     `;

//     // Execute the query
//     const result = await client.query(query);

//     // Return the result rows (grouped by Product and Hour)
//     return result.rows;
//   } catch (error) {
//     console.error('Error fetching product details:', error);
//     throw error;
//   }
// };

const getProductDetailForTimeLineChartsEveryHour = async () => {
  try {
    // SQL query to group orders by hour and sum the quantities
    const query = `
      SELECT
        DATE_TRUNC('hour', created_date) AS hour,
        SUM(quantity) AS total_quantity
      FROM orders
      GROUP BY hour
      ORDER BY hour;
    `;
    
    const result = await client.query(query);
    return result.rows;  // Returns the rows with hour and total quantity
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
  


  module.exports = {
    getProducts,
    getProductsQunaityAndPrice,
    getPrdoductDetailforTimeLineCharts,
    getProductDetailForTimeLineChartsEveryHour
  };