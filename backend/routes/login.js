

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

router.post('/', async (req,res) => {

    try {

        let salt = await bcrypt.genSalt(10)

        let newAdmin = await Admins.findOne({email: req.body.email})

        if (newAdin){
            return res.json('User Already Regirstered !!')

            // redirect to the singup page
        }

        newAdmin = new Admins({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt)
        })

        let token = jwt.sign({id: newAdmin._id, email: newAdmin.email,})

        await newAdmin.save()

        res.json(newAdmin)
        
    } catch (error) {
        console.log('Error creating admin, ',error.message)
        return res.status(401)
    }
})



module.exports = router


