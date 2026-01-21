const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    await authService.registerUser(name, email, password);
    res.status(201).json({ message: "User created! Check email." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const verify = async (req, res) => {
  try {
    await authService.verifyEmail(req.params.token);
    res.send("<h1>Email Verified! You can now login.</h1>");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { register, verify, login };