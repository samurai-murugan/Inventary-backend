const { getProductsFromOrders,getadminProductsFromOrders,getuserProductsFromOrders,getProductsDetails } = require('../model/carddata');

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
const getuserProducts = async (req, res) => {
  const {userid}= req.params;
  console.log("user Data Fetcing", userid)
  try {
   
    const products = await getuserProductsFromOrders(userid);
   
    res.json(products);
  } catch (error) {
    console.error('Error fetching product data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const getCartCards = async (req, res) => {

  console.log("carts Data Fetcing")
  try {
   
    const products = await getProductsDetails();
   
    res.json(products);
  } catch (error) {
    console.error('Error fetching product data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getProducts,
  getAdminProducts,
  getuserProducts,
  getCartCards
};
