

require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 4000
const cors = require('cors')
const path = require('path')
const authRoutes = require('./routes/login')
const bodyParser = require('body-parser')
const connectDB = require('./models/connection')
const Admin = require('./routes/admin')
const Users = require('./routes/users')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/admin',Admin)
app.use('/users', Users)
app.use('/api/auth', authRoutes)

connectDB()
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})