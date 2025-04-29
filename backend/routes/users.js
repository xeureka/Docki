
require('dotenv').config()
const express = require('express')
const Users = require('../models/users.model')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// registering the user


router.post('/register', async (req,res) => {

    try {

        let user = await Users.findOne({email: user.email})

        if (user){
            return res.status(401).json('Students already registered !!')
            // redirect it to login page here
        }

        let salt = await bcrypt.genSalt(10)

        user = new Users({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password,salt)
        })
        
    } catch (error) {
        
    }
})


// logging the user

router.post('/login', async (req,res) => {

    try {

        let user = await Users.findOne({email: req.body.email})

        if (!user){
            return res.status(400).json('user does not exist !!')
        }

        const validPassword = await bcrypt.compare(user.password, req.body.password)

        if (!validPassword){
            return res.status(403).json('Invalid Email or password !!')
        }

        let token = jwt.sign({_id: user.id, email: user.email}, process.env.jwtPrivateKey)

        return res.header('x-auth-token', token).json(token)
        
    } catch (error) {
        console.error('Invalid Credential !!', error.message)
    }
})


module.exports = router


// name,email.passwore