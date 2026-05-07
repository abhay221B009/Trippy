import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { signinSchema, signupSchema } from "../schemas/auth.schemas.js";

export const signinHandler = async (req,res)=>{
  console.log("[signin] req.body:", req.body)
  const parseResult = signinSchema.safeParse(req.body)
  if(!parseResult.success){
    console.log("[signin] validation errors:", parseResult.error.errors)
    return res.status(400).json({message: "invalid json payload", errors: parseResult.error.errors})
  }

  const { email, password } = parseResult.data
  
  const user = await User.findOne({email})
  if(!user) {
    return res.status(404).json({message: "user not found"})
  }
  console.log("user: ", user)

  if(user.password !== password) {
    return res.status(500).json({message: "invalid credential"})
  }

  const token = jwt.sign({
    _id: user._id,
    email: user.email,
    username: user.username,
  }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  })

  console.log(`token ${token}`)

  res.status(200).json({message: "signin successfull", data: {
    token
  }}) 
}

export const signupHandler =  async (req,res)=>{
  try {
    console.log("[signup] req.body:", req.body)
    const parseResult = signupSchema.safeParse(req.body)
  if(!parseResult.success) {
    console.log("[signup] validation errors:", parseResult.error.errors)
    return res.status(400).json({message: "invalid json payload", errors: parseResult.error.errors})
  }

  const {username, email, password} = parseResult.data

  const user = await User.findOne({email})
  console.log(user)
  if(user) {
    return res.status(201).json({message: "user already exists"})
  }

  const dbUser = await User.create({ username, email, password })
  if(!dbUser) {
    return res.status(500).json({message: "internal server error"})
  }

  res.status(200).json({message: "user created successfully", data: { username, email }}) 
  } catch(err) {
    console.log("error occurred ", err)
  } 
}