const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const mongoose = require("mongoose")
const urlRoutes = require("./routes/url.js")
const app = express()

dotenv.config()
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
}))

app.use(express.json())

app.use("/",urlRoutes)

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running on port ${process.env.PORT || 5000}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
    });
