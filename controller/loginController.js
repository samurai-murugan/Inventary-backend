const bcrypt = require('bcryptjs');
const {  getUserByEmail } = require('../model/database');  

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password)
  // console.log(id)

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  try {
  
    const user = await getUserByEmail(email);
    if (!user) {
      // console.log("sam")
      return res.status(400).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.hashedpassword);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }


    return res.status(200).json({
      message: 'User login successful',
      user: {
        id: user.id,
        firstname:user.firstname,
        userName:  user.firstname + ' ' + user.lastname,
        email: user.email_id,
        role: user.role, 
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { loginUser };
