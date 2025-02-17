const UserModel = require('../model/database');

const getUsers = async (req, res) => {
  console.log("from the getusers")
  try {
    if (req.params.email) {
     
      const user = await UserModel.getUserByEmail(req.params.email);
      if (user) {
        return res.json(user); 
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    } else {
      
      const users = await UserModel.getAllUsers();

      const userDetails = users.map(user => ({
        id: user.id,
        userName: user.firstname + ' ' + user.lastname ,
        // username: user.username,
        email_id: user.email_id,
        role: user.role,
        is_verified: user.is_verified,
      }));
      
     
      res.json(userDetails);
    }
  } catch (error) {
    console.error('Error fetching users:', error.message);
    return res.status(500).json({ error: 'Failed to fetch users from the database' });
  }
};
const getUsersByid = async (req, res) => {
  console.log("from the get user", req.params.id)
  
  try {
    if (req.params.id) {
       
      const user = await UserModel.getUserById(req.params.id);
      if (user) {
        return res.json(user); 
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    } else {
      
      const users = await UserModel.getAllUsers();

      const userDetails = users.map(user => ({
        id: user.id,
        userName: user.firstname + ' ' + user.lastname ,
        // username: user.username,
        email_id: user.email_id,
        role: user.role,
        is_verified: user.is_verified,
      }));
      
     console.log(userDetails)
    return  res.json(userDetails);
    }
  } catch (error) {
    console.error('Error fetching users:', error.message);
   return res.status(500).json({ error: 'Failed to fetch users from the database' });
  }
};


const createUser = async (req, res) => {
  const { id, firstname, lastname, role, email_id, hashedpassword, created_date, last_modified_date, is_verified } = req.body;
  
  try {

    const emailExists = await UserModel.checkEmailExists(email_id);
    if (emailExists) {
      return res.status(400).json({ error: 'Email already exists' });
    }


    const newUser = await UserModel.createUser(id, firstname, lastname, role, email_id, hashedpassword, created_date, last_modified_date, is_verified);
   return res.status(201).json(newUser); 
  } catch (error) {
    console.error('Error creating user:', error.message);
   return res.status(500).json({ error: 'Failed to create user' });
  }
};


const updateUserVerification = async (req, res) => {
  const { id } = req.params;
  const { isVerified } = req.body;

  try {
    console.log("update",id)
    const updatedUser = await UserModel.updateUserVerification(id, isVerified);
    if (updatedUser) {
    return  res.status(200).json(updatedUser); 
    } else {
    return  res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user verification status:', error.message);
   return res.status(500).json({ error: 'Failed to update user' });
  }
};
const updateUserdata = async (req, res) => {
  console.log("upadteuser")
  const { id } = req.params;
  const { firstname,lastname } = req.body;
 
  try {
    console.log("update",id,firstname,lastname)
    const updatedUser = await UserModel.updateUserDetails(id, firstname, lastname);
    if (updatedUser) {
    return  res.json(updatedUser); 
    } else {
    return  res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user verification status:', error.message);
   return res.status(500).json({ error: 'Failed to update user' });
  }
};


const deleteUser = async (req, res) => {
  const { id } = req.params;
  
  try {
    const deletedUser = await UserModel.deleteUser(id);
    if (deletedUser) {
     return res.json({ message: 'User deleted successfully', user: deletedUser });
    } else {
    return  res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error.message);
  return  res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUserVerification,
  deleteUser,
  updateUserdata,
  getUsersByid,
};
