
const express = require('express');
const router = express.Router();
const {registerUser} = require('../controller/registerController'); 
const {loginUser} = require('../controller/loginController');
const {getUsers,createUser,updateUserVerification,deleteUser, updateUserdata, getUsersByid}=require("../controller/UserFetching");

router.post('/register', registerUser);
router.post('/login',loginUser);
router.get('/users/:email?',getUsers);
router.get('/usersData/:id?',getUsersByid);

// Create a new user
router.post('/users',createUser);

// Update user verification status
router.put('/users/verify/:id',updateUserVerification);

router.put('/users/updateUser/:id',updateUserdata);

router.delete('/users/:id',deleteUser);


module.exports = router;
