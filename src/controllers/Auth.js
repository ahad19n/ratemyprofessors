const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.get("/", async (req, res) => {
	return res.render("AuthPage");
});

router.post("/signup", async (req, res) => {
	try {
		const { username, password, confirm_password } = req.body || {};
		if (!username || !password || !confirm_password) {
			return res.status(400).render("SignIn", { layout: false, error: "All fields are required for signup." });
		}
		if (password.length < 8) {
			return res.status(400).render("SignIn", { layout: false, error: "Password must be at least 8 characters." });
		}
		if (password !== confirm_password) {
			return res.status(400).render("SignIn", { layout: false, error: "Passwords do not match." });
		}
		const normalizedUsername = String(username).trim().toLowerCase();

		const existing = await User.findOne({ username: normalizedUsername });
		if (existing) {
			return res.status(400).render("SignIn", { layout: false, error: "Username is already taken." });
		}

		const passwordHash = await bcrypt.hash(password, 12);

		const user = await new User({ username: normalizedUsername, passwordHash }).save();

		const secret = process.env.JWT_SECRET;
		const token = jwt.sign({ sub: user._id.toString(), username: user.username }, secret, { expiresIn: "7d" });

		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		});
		return res.status(200).render("IndexPage", { message: "Sign up successful! Welcome aboard." });
	} catch (error) {
		console.error("[SignUp] error", error);
		return res.status(500).render("SignIn", { layout: false, error: "Server error during sign up." });
	}
});

router.post("/login", async (req, res) => {
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
