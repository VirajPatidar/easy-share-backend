require('dotenv').config();

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_CONNECTION_URL);
        console.log('Database connected 🥳');
        // console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log('Connection failed ☹️');
        console.log(error);
        process.exit(1);
    }
}


module.exports = connectDB;