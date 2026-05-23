import User from "../../models/user/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

/**
 * GET ALL USERS
 */
export const getAllUser = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * GET USER BY ID
 */
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // validate mongo id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);

  } catch (error) {
    next(error);
  }
};

/**
 * SIGNUP
 */
export const signUp = async (req, res, next) => {
  try {
    let { firstName, lastName, email, mobile, password } = req.body;

    // normalize email
    email = email.toLowerCase().trim();

    // check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });

  } catch (error) {

    // duplicate key handling
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    next(error);
  }
};

/**
 * SIGNIN
 */
export const signIn = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase().trim();

    // find user with password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // compare password
    const isPasswordMatching = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatching) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // generate token
    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",

      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },

      token,
    });

  } catch (error) {
    next(error);
  }
};

/**
 * CHANGE PASSWORD
 */
export const updatePassword = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { oldPassword, newPassword } = req.body;

    // validate fields
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // prevent same password
    if (oldPassword === newPassword) {
      return res.status(400).json({
        message: "New password cannot be same as old password",
      });
    }

    // password length validation
    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    // find user
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // compare old password
    const isPasswordMatching = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isPasswordMatching) {
      return res.status(400).json({
        message: "Incorrect old password",
      });
    }

    // hash new password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      newPassword,
      salt
    );

    // save
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });

  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE USER
 */
export const updateUser = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const {
      firstName,
      lastName,
      email,
      mobile,
    } = req.body;

    // check if user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // email collision check
    if (email && email !== user.email) {

      const existingEmail = await User.findOne({
        email,
        _id: { $ne: userId },
      });

      if (existingEmail) {
        return res.status(409).json({
          message: "Email already in use",
        });
      }

      user.email = email.toLowerCase().trim();
    }

    // update fields
    user.firstName = firstName ?? user.firstName;
    user.lastName = lastName ?? user.lastName;
    user.mobile = mobile ?? user.mobile;

    await user.save();

    res.status(200).json({
      message: "User updated successfully",

      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });

  } catch (error) {
    next(error);
  }
};

/**
 * DELETE USER
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      message: "User deleted successfully",
    });

  } catch (error) {
    next(error);
  }
};