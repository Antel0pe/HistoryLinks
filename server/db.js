const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

function connectDB() {
    const url = process.env.MONGO_URI;

    try {
        mongoose.connect(url);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }

    const dbConnection = mongoose.connection;
    dbConnection.once("open", (_) => {
        console.log(`Database connected`);
    });

    dbConnection.on("error", (err) => {
        console.error(`connection error: ${err}`);
    });

    return;
}

module.exports = connectDB;