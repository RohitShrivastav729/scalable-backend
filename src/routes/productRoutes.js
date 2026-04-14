const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const redisClient = require("../configs/redisClient");

router.get("/products", authMiddleware, async (req, res) => {
    const cacheKey = "products";

    // 1️⃣ Check Redis (Cache)
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
        return res.json({
            source: "cache",
            data: JSON.parse(cachedData)
        });
    }

    // 2️⃣ Simulate DB call (slow)
    console.log("Fetching from server...");
    const products = ["Laptop", "Phone", "Tablet"];

    // 3️⃣ Store in Redis (TTL 60 sec)
    await redisClient.setEx(cacheKey, 60, JSON.stringify(products));

    // 4️⃣ Return response
    res.json({
        source: "server",
        data: products
    });
});

module.exports = router;