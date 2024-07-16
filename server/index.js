const express = require("express");
const routes = require("./routes");
var cors = require('cors');
const connectDB = require("./db");
const dotenv = require("dotenv").config();


const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.listen(process.env.PORT, () => {
    console.log("Server has started!");
})
