const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
router.post("/", async (req, res) => {
	try {
		const { username, password } = req.body || {};
		if (!username || !password) {
			return res.status(400).render("SignIn", { layout: false, error: "Both username and password are required.", username: username || "" });
		}
		const normalizedUsername = String(username).trim().toLowerCase();

		const user = await User.findOne({ username: normalizedUsername });
		if (!user) {
			return res.status(400).render("SignIn", { layout: false, error: "Invalid username or password.", username: normalizedUsername });
		}

		if (!user.passwordHash) {
			console.error("[Login] user missing passwordHash:", user._id);
			return res.status(400).render("SignIn", { layout: false, error: "Invalid username or password.", username: normalizedUsername });
		}
		const passwordMatch = await bcrypt.compare(password, user.passwordHash);
		if (!passwordMatch) {
			return res.status(400).render("SignIn", { layout: false, error: "Invalid username or password.", username: normalizedUsername });
		}

		const secret = process.env.JWT_SECRET;
		if (!secret) {
			console.error("[Login] missing JWT_SECRET");
			return res.status(500).render("SignIn", { layout: false, error: "Server configuration error." });
		}
		const token = jwt.sign({ sub: user._id.toString(), username: user.username }, secret, { expiresIn: "7d" });

		res.cookie("token", token, {
			httpOnly: true,
			secure: req.secure || process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		});
		return res.status(200).render("IndexPage", { message: "Log in successful! Welcome aboard." });
	} catch (error) {
		console.error("[Login] error", error);
		return res.status(500).render("SignIn", { layout: false, error: "Server error during login." });
	}
});

module.exports = router;
