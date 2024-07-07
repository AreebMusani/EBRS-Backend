const mongoose = require('mongoose')
const dotenv = require("dotenv").config();

mongoose.connect(process.env.DB_URI, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    connectTimeoutMS: 30000 // Set the timeout to 30 seconds (30000 milliseconds)
}).then(() => {
    console.log('Successfully Established Connection With MongoDB.')
}).catch((err)=> {
    console.log('Error While Connecting With MongoDB.', err)
})

