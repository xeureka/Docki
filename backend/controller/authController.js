

require('dotenv').config()
const {doHash,doHashValidation} = require('../utils/hashing')
const {signUpSchema} = require('../middleware/validator') 
const jwt = require('jsonwebtoken')
const Users = require('../models/users.model')

async function signUp(req,res) {

    const {email,password} = req.body


    try {

        const {error,value} = signUpSchema.validate({email,password})

        if (error){
            return res.status(401).json({success: false, message: error.details[0].message})
        }


        const isExistingUser = await Users.findOne({email})

        if (isExistingUser){
            return res.status(401).json({success: false, message: 'User already exists'})
        }

        const hashedPassword = await doHash(password)

        const newUser = new Users({
            name,
            email,
            password: hashedPassword
        })

        const result = await newUser.save()

        result.password = undefined

        res.status(201).json({
            success: true,
            message: 'User created Sucessful !!',
            result
        })
        
    } catch (error) {
        console.log(error)
    }
    
}


async function signIn(req,res){

    const {email,password} = req.body

    try {
        const {error,value} = signUpSchema.validate({email,password})

        if (error){
            return res.status(401).json({success: false, message: error.details[0].message})
        }

        const existingUser = await Users.findOne({email}).select('+password')

        if (!existingUser){
            return res.status(401).json({success: false, message: 'User dont exists'})
        }
        
        const result = await doHashValidation(password,existingUser.password)

        if (!result){
            return res.status(401).json({success: false, message: 'Invalid credentials !!'})
        }

        const token = jwt.sign({
            useId: existingUser._id,
            email: existingUser.email,
            verified: existingUser.verified
        },
        process.env.jwtPrivateKey,{expiresIn: '8h'}
    
    )

    res.cookie('Authorization','Bearer '+ token,{expires: new Date(Date.now() + 8*3600000)})
    res.json({
        success: true,
        token,
        message: 'logged in successfully'
    })

            
    } catch (error) {
        console.log(error)
    }
}

async function signOut(req,res){

    res.clearCookie('Authorization').status(200).json({
        success: true, message: 'Loged out successfully !!'
    })
}



module.exports = {
    signUp,
    signIn,
    signOut,
}

