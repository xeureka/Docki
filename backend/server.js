

require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 4000


const connectDB = require('./models/connection')
const Admin = require('./routes/admin')
const Users = require('./routes/users')

app.use(express.json())

app.use('/admin',Admin)
app.use('/users', Users)


connectDB()
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})