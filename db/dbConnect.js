const mongoose = require("mongoose");
require("dotenv").config(); // Đọc các biến môi trường từ file .env

async function dbConnect() {
    mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log("Successfully connected to MongoDB Atlas!");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB Atlas!", error);
    });
}

module.exports = dbConnect;

dbConnect();
