const express = require("express");
const app = express();
require('dotenv').config();
const cors = require('cors');
const bcrypt = require('bcrypt'); 
const userRouter = require('./router/routes');
const productRouter = require('./router/product.routes')
const orderRouter = require('./router/order.router')
const charRouter = require('./router/chart.router')
const carddatas = require('./router/cards.router')
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  

app.use('/users', userRouter);
app.use('/product', productRouter);
app.use('/orders', orderRouter);
app.use('/charts', charRouter);
app.use('/productsData', carddatas);

const client = require('./dbconfig');
const moment = require('moment');

const originalDate = new Date();
const created_date = moment(originalDate).format('YYYY-MM-DD HH:mm');
const last_modified_date = moment(originalDate).format('YYYY-MM-DD HH:mm');
const id = "U-2025A0001";

const checkAndInsertUser = async (id, firstname, lastname, email_id, password) => {
  const is_verified = true;
  const role = "admin";
  const saltRounds = 10; 

  try {

    const checkQuery = 'SELECT * FROM users WHERE email_id = $1';
    const result = await client.query(checkQuery, [email_id]);

    if (result.rows.length > 0) {
      console.log("User already exists in the database!");
      return 'User already exists in the database!';
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertQuery = `INSERT INTO users (id, firstname, lastname, role, email_id, hashedpassword, created_date, last_modified_date, is_verified) 
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
                         RETURNING id, firstname, lastname, email_id, role`;

    const data = await client.query(insertQuery, [id, firstname, lastname, role, email_id, hashedPassword, created_date, last_modified_date, is_verified]);

    return 'User inserted successfully!';
  } catch (err) {
    console.error("Error with database query:", err.message);
    throw new Error('Error checking or inserting user: ' + err.message);
  }
};

const initialData = async () => {
  const email_id = process.env.EMAIL;
  const firstname = process.env.FIRSTNAME;
  const lastname = process.env.LASTNAME;
  const password = process.env.PASSWORD;

  try {
    
    if (!email_id || !firstname || !lastname || !password) {
      console.log("Environment variables are not properly set!");
      return;
    }

 
    const result = await checkAndInsertUser(id, firstname, lastname, email_id, password);
    console.log(result, id);
  } catch (err) {
    console.error("Registration error:", err.message);
  }
};

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
  initialData();  
});

