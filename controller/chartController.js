
const {getProducts,getProductsQunaityAndPrice} = require('../model/chartdb')

const getAllProducts = async (req, res) => {
  try {
    const result = await getProducts();
    res.json(result); 
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error retrieving data' });
  }
};
const getAllProductsQunaityAndPrice = async (req, res) => {
  try {
    const result = await getProductsQunaityAndPrice();
    res.json(result); 
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error retrieving data' });
  }
};

module.exports = {
    getAllProducts,
    getAllProductsQunaityAndPrice,
};
