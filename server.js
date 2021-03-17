const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error')

// Loading env files
dotenv.config({
    path: './config/config.env'
});

// Connect to database
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');
const logger = require('./middleware/logger')

const app = express();

// Body parser
app.use(express.json());

// logger middleware for Dev
if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'))
}


app.use('/api/v1/bootcamps', bootcamps)
app.use(errorHandler) 


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.yellow.bold));

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red)
    server.close(() => {
        process.exit(1)
    })
})