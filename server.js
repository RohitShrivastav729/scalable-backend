

const dotenv = require('dotenv');
dotenv.config();
require("./src/configs/redisClient");
const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send("Scalable Backend Running..");
});

const authRoutes = require("./src/routes/authRoutes");

app.use("/auth", authRoutes);

const productRoutes = require("./src/routes/productRoutes");

app.use("/api", productRoutes);

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
    console.log(`App is running at port ${PORT}`);
})

