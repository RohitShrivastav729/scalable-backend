
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userService = require("../services/userService");
const redisClient = require("../configs/redisClient");


const SECRET = "mysecret"; // later env

const signup = async (req, res) => {
    const { email, password } = req.body;

    const existing = userService.findUserByEmail(email);
    if (existing) return res.status(400).json({ message: "User exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = userService.createUser({ email, password: hashedPassword });

    res.json({ message: "User created", user });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = userService.findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: user.email }, SECRET, { expiresIn: "1h" });

    res.json({ token });
};

const logout = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];

    // store token in Redis with expiry
    await redisClient.setEx(token, 3600, "blacklisted");

    res.json({ message: "Logged out successfully" });
};


module.exports = {
    signup,
    login,
    logout
};