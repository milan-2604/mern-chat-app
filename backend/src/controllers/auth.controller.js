import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const signup = async (req,res)=>{
   try {
    const {fullName,email,password} = req.body; 
    if(!fullName || !email || !password) return res.status(400).json({message: "All fields required"});
   if(password.length<6){
  return  res.status(400).json({message: "Password must be atleast 6 letters long"});
   }
   const user = await User.findOne({email});
   if(user)return res.status(400).json({message: "User already exist"});

   const salt = await bcrypt.genSalt(10);
   const hashedPass = await bcrypt.hash(password,salt);
   const newUser = new User({
    fullName,
    email,
    password: hashedPass,
   });
   if(newUser){
        generateToken(newUser._id,res);
        await newUser.save();
        return res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });
   }else{
    return res.status(400).json({message:"Invalid user data"});
   }

   } catch (error) {
    console.log("Error in signup controller:",error.message);
    return res.status(500).json({message: "Internal server error"});
   } 
}
export const login = async (req,res)=>{
    try {
       const {email,password} = req.body;
       if(!email || !password) return res.status(400).json({message: "All fields required"});
       const user = await User.findOne({email});
       if(!user)return res.status(400).json({message: "Invalid credentials"});
       const isCorrectPass = await bcrypt.compare(password,user.password);
       if(!isCorrectPass)return res.status(400).json({message:"Invalid credentials"});
       generateToken(user._id,res);
       return res.status(201).json({
       _id:user._id,
       fullName:user.fullName,
       email:user.email,
       profilePic:user.profilePic, 
       });
    } catch (error) {
        console.log("Error in login controller",error.message);
        return res.status(500).json({message: "Internal server error"});
    }
}
export const logout = (req,res)=>{
    try {
       res.cookie("jwt","",{maxAge:0});
       return res.status(200).json({message: "user logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller",error.message);
        return res.status(500).json({message: "Internal server error"});
    }
}
export const updateProfile = async (req,res)=>{
    
}