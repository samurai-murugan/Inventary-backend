const bcrypt = require('bcryptjs');
const { checkEmailExists, createUser } = require('../model/database');
const client = require('../dbconfig');
const moment = require('moment');

const originalDate = new Date();
const created_date = moment(originalDate).format('YYYY-MM-DD HH:mm');
const last_modified_date = moment(originalDate).format('YYYY-MM-DD HH:mm');

const generateNewId = async (lastGeneratedId) => {
  const regex = /^U-(\d{4})([A-Z])(\d{4})$/;
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
      return `U-${newYear}A0001`; 
    } else {
      letter = String.fromCharCode(letter.charCodeAt(0) + 1); 
    }
  }

  const paddedNumber = number.toString().padStart(4, '0');
  const newId = `U-${year}${letter}${paddedNumber}`;

  const existingIdCheck = await client.query('SELECT id FROM users WHERE id = $1', [newId]);
  if (existingIdCheck.rows.length > 0) {
   
    return generateNewId(newId);
  }

  return newId;
};

const registerUser = async (req, res) => {
  console.log("working fine");
  const { firstname, lastname, email, password, confirmpassword } = req.body;
  console.log(req.body);
  console.log(firstname);

  const role = 'user';

  if (!firstname) {
    return res.status(400).json({ error: 'First name is required' });
  }

  if (!lastname) {
    return res.status(400).json({ error: 'Last name is required' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (password !== confirmpassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long, with a mix of uppercase and lowercase letters' });
  }

  try {
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const lastUser = await client.query('SELECT id FROM users ORDER BY created_date DESC LIMIT 1');
    const lastGeneratedId = lastUser.rows.length > 0 ? lastUser.rows[0].id : 'U-0000A0001'; // Default ID if no user exists

    const id = await generateNewId(lastGeneratedId);

    const hashedpassword = await bcrypt.hash(password, 10);
    const is_verified = false;

    const newUser = await createUser(
      id, firstname, lastname, role, email, hashedpassword, created_date, last_modified_date, is_verified
    );

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        userName: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Error during user registration:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { registerUser };
