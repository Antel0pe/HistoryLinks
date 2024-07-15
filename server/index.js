const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
var cors = require('cors');


mongoose
    .connect("mongodb://127.0.0.1:27017/test")
    .then(() => {
        const app = express();

        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        app.use("/api", routes);

        app.listen(5000, () => {
            console.log("Server has started!");
        })
    });