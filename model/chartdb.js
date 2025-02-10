

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
  
  module.exports = {
    getProducts,
    getProductsQunaityAndPrice
  };