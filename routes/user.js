const { signup, deleteUser, updateUser, getUser } = require('../contollers/userInfo.js')
const { verifyToken } = require('../auth/user')
const { User } = require('../models/userModel.js')

const express = require('express')

const router = express.Router()

router.put('/signup/:id', updateUser())
router.delete('/signup/:id', deleteUser())
router.get('/signup', getUser())
router.post('/signup', signup())  



  

module.exports = router;