const { getProductsFromOrders,getadminProductsFromOrders } = require('../model/carddata');

const getProducts = async (req, res) => {
  try {
   
    const products = await getProductsFromOrders();
   
    res.json(products);
  } catch (error) {
    console.error('Error fetching product data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAdminProducts = async (req, res) => {
  try {
   
    const products = await getadminProductsFromOrders();
   
    res.json(products);
  } catch (error) {
    console.error('Error fetching product data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getProducts,getAdminProducts
};
