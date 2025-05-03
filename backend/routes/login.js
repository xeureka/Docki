require('dotenv').config()
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Users = require('../models/users.model')

const router = express.Router()

// Registration route
router.post('/register', async (req, res) => {
    try {
        let existingUser = await Users.findOne({ email: req.body.email })

        if (existingUser) {
            // Redirect to login if user already exists
            return res.redirect('/login')
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        let newUser = new Users({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })

        await newUser.save()

        // Create a JWT token for the new user
        let token = jwt.sign(
            { email: newUser.email, _id: newUser._id },
            process.env.jwtPrivateKey,
            { expiresIn: '1d' }
        )

        res.json(token) // Send the token back to the user
    } catch (error) {
        console.error('Error Registering the User:', error.message)
        res.status(500).send('Internal Server Error')
    }
})

// Login route
router.post('/login', async (req, res) => {
    try {
        let user = await Users.findOne({ email: req.body.email })

        if (!user) {
            // Redirect to register if user does not exist
            return res.redirect('/register')
        }

        let isValidPassword = await bcrypt.compare(req.body.password, user.password)

        if (!isValidPassword) {
            return res.status(401).json('Email or Password Incorrect!!')
        }

        // Generate a token and respond with it
        let token = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.jwtPrivateKey,
            { expiresIn: '1d' }
        )
        
        res.json(token) // Send the token back to the user
    } catch (error) {
        console.log('Error Logging in:', error.message)
        res.status(500).send('Internal Server Error')
    }
})

module.exports = router