import User from "../../models/user/users.js";
import { isAuthenticated } from "../../middleware/userMiddleware.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getAllUser = async (req, res) => {
  try {
    const data = await User.find();
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
export const getUserById = async (req, res) => {
  try {
    const getId = await User.findById(req.params.id);

    if (!getId) {
      const error = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ getId });
  } catch (error) {
    next(error);
  }
};
/** 
export const registerUser = async (req, res) => {
    try {
        if (
            !req.body ||
            !req.body.firstName ||
            !req.body.lastName ||
            !req.body.email ||
            !req.body.mobile
        ) {
            return res.status(400).json({ error: "some field is missing" });
        }

        const { firstName, lastName, email, mobile } = req.body;
        console.log(firstName, lastName, email, mobile);
        const user = new User({
            firstName,
            lastName,
            email,
            mobile,
        });
        await user.save();

        res.status(201).json({ message: "inserted success" });
    } catch (error) {
        console.log(error);
    }
};
*/

export const signUp = async (req, res) => {
  try {

    const { firstName, lastName, email, mobile, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const updatePassword= async(req,res,next)=>
{
  try {

    console.log("hello world");
    const userId = req.user._id
    //console.log(userId); 

    const{oldPassword, newPassword}=req.body
    //console.log(oldPassword,newPassword);

    const user=await User.findById(userId)
    //console.log(userId);

    if(!user)
    {
      return res.status(404).json({message:"user not found"});
    }
    //console.log(user.password);
    const isPasswordMacthing=await bcrypt.compare(oldPassword,user.password);
    if(!isPasswordMacthing)
    {
      return res.status(400).json({message:"incorrect password"});
    }

    const salt=await bcrypt.genSalt(10);
    const newHashedPassword=await bcrypt.hash(newPassword,salt);
   // console.log(newHashedPassword);

    user.password= newHashedPassword;
    await user.save();

    res.status(200).json({message:"password changed successfully"});
    
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};


export const signIn = async (req, res, next) => {
  try {
    // console.log('req.body:', req.body);
    //console.log('req.headers:', req.headers);
    console.log("email");
    const { email, password } = req.body;
    console.log(email);
    console.log(password);
    console.log("here");

    //find email
    const isUser = await User.findOne({ email: email });
   // console.log("userrrrrrrrs");
    if (!isUser) {
      return res.status(409).json({ message: "invalid creds" });
    }

    //campare password
    const isPasswordMacthing = await bcrypt.compare(password, isUser.password);
    console.log("password matching block");
    if (!isPasswordMacthing) {
      return res.status(400).json({ message: "invalid creds" });
    }
    // console.log("token k upar")
    //create token
    const token = jwt.sign({ _id: isUser._id, role:isUser.roles }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    //console.log("token nai milla")
    console.log(token);
    //send response

    res.status(201).json({
      message:"login Successful",
      id: isUser._id,
      email: isUser.email,
      firstName: isUser.firstName,
      lastName: isUser.lastName,
      mobile: isUser.mobile,
      roles:isUser.roles,
      token
    });
  } catch (error) {
    console.log("inside login catch");
    res.status(500).json({ message: "something went wrong" });
  }
};
export const updateUser = async (req, res) => {
  try {
    const upUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        mobile: req.body.mobile,
      },
      { new: true }
    );

    if (!upUser) {
      const error = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(upUser);
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
};
export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json({ message: "User deleted" });
};
