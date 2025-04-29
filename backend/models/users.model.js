



const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    
    name: {type:String, required: true},
    email: {type: String, required: true},
    role: {type: String, default: 'student'}, // either (student,admin)
    password: {type: String, required: true}
})


const Users = mongoose.model('User',userSchema)


module.exports = Users