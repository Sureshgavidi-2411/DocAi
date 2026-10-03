const {
  registerUser,
  loginUser,
} = require("../services/authService");

const generateToken = require("../utils/jwt");

const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await loginUser(req.body);

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};