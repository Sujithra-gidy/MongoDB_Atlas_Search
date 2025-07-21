require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { db } = require("./database/db");
db();
const profileRoute = require("./routes/profile-route");
const searchRoute = require("./routes/search-route");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' })); //helps to insert large number of documents. 
app.use("/api", profileRoute, searchRoute);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})