
require('dotenv').config()
const jwt = require('jsonwebtoken')


function adminRoute(req,res,next){

    let token = req.headers['x-auth-token']

    if (!token){
        return res.status(500).json('No Token Provided !!')
    }

    try {

        let verifyToken = jwt.verify(token,process.env.jwtPrivateKey)
        console.log(verifyToken)

        if (!verifyToken){
            return res.status(403).send('Forbiden !!')
        }

        next()
        
    } catch (error) {
        console.error('Token verification error: ',error.message)
        return res.status(403)
    }

}



module.exports = {
    adminRoute
}