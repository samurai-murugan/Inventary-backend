const { checkProductExist, createProduct, deleteProduct, getAllProducts,updateProduct,getProductPerPrice,getProductsName } = require('../model/productdb');
const client = require('../dbconfig');
const moment = require('moment');

const generateNewId = async (lastGeneratedId) => {
    const regex = /^P-(\d{4})([A-Z])(\d{4})$/; 
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
            return `P-${newYear}A0001`; 
        } else {
            letter = String.fromCharCode(letter.charCodeAt(0) + 1); 
        }
    }

    const paddedNumber = number.toString().padStart(4, '0');
    const newId = `P-${year}${letter}${paddedNumber}`;

    const existingIdCheck = await client.query('SELECT productid FROM products WHERE productid = $1', [newId]);
    if (existingIdCheck.rows.length > 0) {
        return generateNewId(newId); 
    }

    return newId;
};

const addProducts = async (req, res) => {
    const { productname, quantity, price } = req.body;
    console.log(productname, quantity, price)

    if (!productname || typeof productname !== 'string') {
        return res.status(400).json({
            message: 'Product name is required and must be a valid string.',
        });
    }

    if (isNaN(quantity) || quantity < 0) {
        return res.status(400).json({
            message: 'Product quantity is required and must be a non-negative number.',
        });
    }

    if (isNaN(price) || price <= 0) {
        return res.status(400).json({
            message: 'Product price is required and must be a positive number.',
        });
    }

    try {
        const existingProduct = await checkProductExist(productname);
        if (existingProduct) {
            return res.status(400).json({ message: 'Product with this name already exists.' });
        }

        const originalDate = new Date();
        const created_date = moment(originalDate).format('YYYY-MM-DD HH:mm');
        const modified_date = moment(originalDate).format('YYYY-MM-DD HH:mm');

        const lastProduct = await client.query('SELECT productid FROM products ORDER BY created_date DESC LIMIT 1');
        const lastGeneratedId = lastProduct.rows.length > 0 ? lastProduct.rows[0].productid : 'P-0000A0001'; // Default ID if no product exists
    
        const productid = await generateNewId(lastGeneratedId);
                                              //productid, productname, price, quantity, created_date, modified_date,created_date
        const newProduct = await createProduct(productid, productname, price, quantity, created_date, modified_date);

        return res.status(201).json({
            message: 'Product created successfully',
            newProduct: {
                productid: newProduct.productid,
                productname: newProduct.productname,
                price: newProduct.price,
                quantity: newProduct.quantity,
            },
        });

    } catch (error) {
        console.error('Error adding product:', error);
        return res.status(500).json({ message: 'Error adding product', error: error.message });
    }
};

// Delete product by ID
const deleteProductById = async (req, res) => {
    const { productid } = req.params; 

    if (!productid) {
        return res.status(400).json({
            message: 'Product ID is required.',
        });
    }

    try {
        const productExists = await client.query('SELECT * FROM products WHERE productid = $1', [productid]);

        if (productExists.rows.length === 0) {
            return res.status(404).json({
                message: 'Product not found.',
            });
        }

        await deleteProduct(productid);

        return res.status(200).json({
            message: 'Product deleted successfully.',
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({
            message: 'Error deleting product',
            error: error.message,
        });
    }
};

// Get all products
const getAllProductsController = async (req, res) => {
    console.log("geting data")
    try {
        const products = await getAllProducts();
        
        if (products.length === 0) {
            return res.status(404).json({
                message: 'No products found.',
            });
        }
     
        const productDetails = products.map(product => {
          
            const added_date = new Date(product.created_date);
        
            const options = {
               
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            };
            
            // Convert to IST and format as 'YYYY-MM-DD hh:mm AM/PM'
            const formattedDate = added_date.toLocaleString('en-IN', options).replace(',', '').replace(/\//g, '-');
            const formattedPrice = parseFloat(product.price).toLocaleString('en-IN', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            });
            return {
                id: product.productid,
                productname: product.productname,
                quantity:Number(product.quantity).toLocaleString(),
                price: formattedPrice,
                productAddedDate: formattedDate,
            };
        });

        // const productDetails = products.map(product => ({
        //     id: product.productid,
        //     productname: product.productname,
        //     quantity: product.quantity,
        //     price: product.price,
        // }));

    
        return res.status(200).json({
            message: 'Products fetched successfully.',
            products: productDetails,
        });

    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({
            message: 'Error fetching products.',
            error: error.message,
        });
    }
};





const updateProductHandler = async (req, res) => {

    console.log("updatehandlere")
    const { productid } = req.params; 
    const { productname, quantity, price } = req.body;
    console.log(productid)
    console.log(productname,quantity,price) 

    console.log("price",price)
     
    if (productname && typeof productname !== 'string') {
        return res.status(400).json({
            message: 'Product name must be a valid string.',
        });
    }

    if (quantity !== undefined && (isNaN(quantity) || quantity < 0)) {
        return res.status(400).json({
            message: 'Product quantity must be a non-negative number.',
        });
    }

    if (price == undefined ) {
        return res.status(400).json({
            message: 'Product price must be a positive number.',
        });
    }

    try {
        // Check if the product exists using db function
        const product = await client.query('SELECT * FROM products WHERE productid = $1', [productid]);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found.',
            });
        }

        const updateData = {};
        
        if (productname) updateData.productname = productname;
        if (quantity !== undefined) updateData.quantity = quantity;
        if (price !== undefined) updateData.price = price;
        const originalDate = new Date(); 
        const modified_date =  moment(originalDate).format('YYYY-MM-DD hh:mm ');
          updateData.modified_date = modified_date
        
        const updatedProduct = await updateProduct(productid, updateData);

        return res.status(200).json({
            message: 'Product updated successfully.',
            updatedProduct: {
                productid: updatedProduct.productid,
                productname: updatedProduct.productname,
                price: updatedProduct.price,
                quantity: updatedProduct.quantity,
                modified_date: updatedProduct.modified_date,
            },
        });

    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({
            message: 'Error updating product.',
            error: error.message,
        });
    }
};


const getProductPrices = async (req, res) => {

    console.log("product price")
    try {

      const result = await getProductPerPrice();
  
      const productPrices = result.reduce((acc, row) => {
        acc[row.productname] = row.price;
        return acc;
      }, {});
  
      // Send the product prices as JSON
      res.json(productPrices);
    } catch (error) {
      console.error('Error fetching product prices', error);
    return res.status(500).json({ message: 'Error fetching product prices' });
    }
  };
  const getProducts = async (req, res) => {
    console.log("Fetching product names...");
  
    try {
      
      const result = await getProductsName(); 
      const productNames = result.map(row => row.productname);
    return res.json(productNames);
  
    } catch (error) {
      console.error('Error fetching product names:', error);
     return res.status(500).json({ message: 'Error fetching product names' });
    }
  };
  

module.exports = { addProducts, deleteProductById, getAllProductsController ,updateProductHandler,getProductPrices,getProducts};
