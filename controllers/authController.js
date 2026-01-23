const authService = require('../services/authService');
const userService = require('../services/userService');

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

const updateUser = async (req, res) => {
  try {
    const { userId, profilePicture } = req.body;
    
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    // Delegate to Service Layer
    const updatedUser = await userService.updateUserProfile(userId, profilePicture);
    
    res.json(updatedUser);
  } catch (err) {
    console.error("Update User Error:", err); // Log error to terminal
    res.status(500).json({ message: err.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await userService.changePassword(userId, oldPassword, newPassword);
    res.json(result);

  } catch (err) {
    // Return 400 for bad password, 500 for server errors
    const status = err.message === 'Incorrect current password' ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
};

module.exports = { register, verify, login, updateUser, updatePassword };