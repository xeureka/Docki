

require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 4000


const connectDB = require('./models/connection')
const Admin = require('./routes/admin')

app.use(express.json())

app.use('/admin',Admin)


connectDB()
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})