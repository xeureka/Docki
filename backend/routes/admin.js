

require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const Admins = require('../models/admin.model')
const router = express.Router()

// List of all the admins
router.get('/', async (req,res) =>{

    try {

        const admins = await Admins.find()

        res.json(admins)

    } catch (error) {
        console.error('Error Fetching admins, ',error.message)
        return res.status(401)
    }
})

// registering new admin

router.post('/register', async (req,res) => {

    try {

        let salt = await bcrypt.genSalt(10)

        let newAdmin = await Admins.findOne({email: req.body.email})

        if (newAdmin){
            return res.json('User Already Regirstered !!')
            // redirect to the sign up route
        }

        newAdmin = new Admins({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt)
        })

        let token = jwt.sign({id: newAdmin._id, email: newAdmin.email,},process.env.jwtPrivateKey)

        await newAdmin.save()

        res.json(newAdmin)
        
    } catch (error) {
        console.log('Error creating admin, ',error.message)
        return res.status(401)
    }
})


router.post('/login', async (req,res) => {

    try {

        let adminUser = await Admins.findOne({email: req.body.email})

        if (!adminUser){
            return res.status(403).json('No admin with a given email !!')
        }

        const password = req.body.password;

        let validPassword = await bcrypt.compare(password, adminUser.password)

        if (!validPassword){
            return res.status(401).json('Invalid username or password !!')
        }

        let token = jwt.sign({_id: adminUser._id,email: adminUser.email},process.env.jwtPrivateKey)

        return res.header('x-auth-token',token).json(token)

        // redirect the user to the admin dashboard
        
    } catch (error) {
        console.log('Error loggin user: ',error.message)
    }

})


module.exports = router

