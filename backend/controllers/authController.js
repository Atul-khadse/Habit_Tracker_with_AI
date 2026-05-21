import { sign } from "jsonwebtoken";
import User from "../models/User"

export const register = async (req , res ) => {
    try {
        
    
    if(!name || !email || !password){
        return res.status(400).json({ messege: "Name, email , password are require"})
    }

    if(password.length < 6){
        res.status(400).json({ message: "passwors must be at 6 character"})
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if(exists){
        return res.status(400).json({ message: "email already register" })
    }

    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        avtar: name.charAt(0).toLowerCase(),
    });

    const token = signToken(user._id);
    res.status(201).json({ user, token})
    } catch (error) {
        res.status(500).json({ message: error.message})
        
    }
};


export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password)
            return res.status(400).json({ message: "email, password reqiired"})

        const user = User.findOne({ email: email.toLowerCase()})
        if(!user || !(await user.matchPassword(password))){
            return res.status(400).json({ message: "invalid email or password"})
        }
  
        const token = signToken(user._id);
        res.status({ user, token})
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
};



export const me = async (req, res) => {
    res.json({user: req.user})
}


export const updateprofile = async (req, res) => {
    try {
        const { name, morningMotivation } = req.body;
        const user = await User.findOne(req.user._id);
        if(name !== undefined){
            user.name = name;
            user.avatar = name.chatAt(0).toUpperCase();
        }

        if(morningMotivation !== undefined)
            user.morningMotivation = mornningMotivation;
        await user.save();
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
}