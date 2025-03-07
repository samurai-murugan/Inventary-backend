const client = require('../dbconfig');

const checkProductExist = async (productname) => {
    const query = 'SELECT * FROM products WHERE productname = $1';
    const result = await client.query(query, [productname]);
    return result.rows.length > 0;
};

const createProduct = async (productid, productname, price, quantity, created_date, modified_date) => {
    const query = `
        INSERT INTO products (productid, productname, price, quantity, created_date, modified_date)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING productid, productname, price, quantity, created_date, modified_date
    `;
    const result = await client.query(query, [productid, productname, price, quantity, created_date, modified_date]);
    return result.rows[0];
};

const getAllProducts = async () => {
    try {
        const query = 'SELECT * FROM products';
        const result = await client.query(query);
        return result.rows; 
    } catch (error) {
        throw new Error('Error fetching products: ' + error.message);
    }
};

const deleteProduct = async (productid) => {
    try {
        const query = 'DELETE FROM products WHERE productid = $1';
        await client.query(query, [productid]);
    } catch (error) {
        throw new Error('Error deleting product: ' + error.message);
    }
};


const updateProduct = async (productid, updateData) => {
    const { productname, quantity, price, modified_date } = updateData;
    console.log(productname, quantity, price, modified_date )
    const result = await client.query(
        'UPDATE products SET productname = $1, quantity = $2, price = $3, modified_date = $4 WHERE productid = $5 RETURNING *',
        [productname, quantity, price, modified_date, productid]
    );
    return result.rows[0];
};
const updateProductQuanity = async (productname, quantity) => {
   
    const result = await client.query(
        'UPDATE products SET quantity = $1 WHERE productname = $2 RETURNING *',
        [quantity,productname ]
    );
    return result.rows[0];
};

const getProductPerPrice = async ()=>{
    const result = await client.query('SELECT productname, price FROM products');
    return result.rows;
}
const getProductsName = async () => {
    try {
      const result = await client.query('SELECT productname FROM products');
      return result.rows; // This will return an array of rows from the query
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error; // Rethrow error to be handled by the calling function
    }
  };

  const getProductQuanatity = async(productname)=>{
    try{
        const result = await client.query('SELECT quantity FROM products WHERE productname = $1',[productname])
       return result.rows;
    }
    catch(error){
        console.error('Error fetcing products and quantity');
        throw error;
    }
  }
module.exports = { checkProductExist, createProduct, deleteProduct,getAllProducts,updateProduct,updateProductQuanity,getProductPerPrice,getProductsName,getProductQuanatity};
