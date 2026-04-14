
const jwt = require("jsonwebtoken");

const SECRET = "mysecret";
const redisClient = require("../configs/redisClient");

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    // Format: Bearer token
    const token = authHeader.split(" ")[1];

    // 🔴 Check blacklist
    const isBlacklisted = await redisClient.get(token);

    if (isBlacklisted) {
        return res.status(401).json({ message: "You are logged out from the system, please login" });
    }

    try {
        const decoded = jwt.verify(token, SECRET);

        req.user = decoded; // attach user info
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;