const client = require('../dbconfig');  


const checkEmailExists = async (email) => {
  const query = 'SELECT * FROM users WHERE email_id = $1';
  const result = await client.query(query, [email]);
  return result.rows.length > 0;  
};

const createUser = async (id, firstname, lastname, role, email_id, hashedpassword, created_date, last_modified_date, is_verified) => {
  const query = `INSERT INTO users (id, firstname, lastname, role, email_id, hashedpassword, created_date, last_modified_date, is_verified) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
                 RETURNING id, firstname, lastname, email_id, role`;
  
  const result = await client.query(query, [id, firstname, lastname, role, email_id, hashedpassword, created_date, last_modified_date, is_verified]);
  return result.rows[0];  
};


const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email_id = $1';
  const result = await client.query(query, [email]);
  if (result.rows.length > 0) {
    console.log("user", result)
    return result.rows[0]; 
  }
  return null;  
};
const getUserById = async (id) => {
  console.log("db", id)
  const query = 'SELECT * FROM users WHERE id = $1';
  const result = await client.query(query, [id]);
  if (result.rows.length > 0) {
    return result.rows[0]; 
  }
  return null;  
};

const deleteUser = async (id) => {
  const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
  const result = await client.query(query, [id]);
  return result.rows.length > 0 ? result.rows[0] : null; 
};


const updateUserVerification = async (id, isVerified) => {
  const query = 'UPDATE users SET is_verified = $1 WHERE id = $2 RETURNING *';
  const result = await client.query(query, [isVerified, id]);
  return result.rows.length > 0 ? result.rows[0] : null; 
};
const updateUserDetails = async (id, firstname, lastname) => {
  const query = 'UPDATE users SET firstname = $1, lastname = $2 WHERE id = $3 RETURNING *';
  
  const result = await client.query(query, [firstname, lastname, id]);
  
  return result.rows.length > 0 ? result.rows[0] : null; 
};



const getAllUsers = async () => {
  try {
    const result = await client.query('SELECT * FROM users');
    return result.rows; 
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};


module.exports = {
  checkEmailExists,
  createUser,
  getUserByEmail,
  deleteUser,
  getAllUsers,
  updateUserVerification,
  updateUserDetails,
  getUserById,
};
