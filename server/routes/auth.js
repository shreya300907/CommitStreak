import express from 'express';
import jwt from 'jsonwebtoken';
import Otp from '../models/Otp.js';
import User from '../models/User.js';

const router=express.Router();

function generateOtp(){
    return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post('/request-otp',async(req,res)=>{
    const {email}=req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const otp=generateOtp();
    const expiresAt=new Date(Date.now() + 10*60*1000);
    await Otp.deleteMany({email});
    await Otp.create({email,otp,expiresAt});
    await fetch(process.env.APPS_SCRIPT_URL,{
        method: 'POST',
        body:JSON.stringify({
            secret:process.env.APPS_SCRIPT_SECRET,
            to: email,
            subject: 'Your CommitStreak verification OTP.',
            html:`<p>Your OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>`
        })
    });
    res.json({success:true});
});

router.post('/verify-otp',async(req,res)=>{
    const {email,otp}= req.body;
    const record =await Otp.findOne({email,otp});
    if(!record || record.expiresAt< new Date){
        return res.status(401).json({error:"Invalid or expired OTP."})
    }
    await Otp.deleteMany({email});
    let user=await User.findOne({email});
    if(!user){
        user=await User.create({email});
    }
    const token=jwt.sign({email:user.email, user_id:user._id},process.env.AUTH_SHARED_SECRET, {expiresIn: '7d'});
    res.json({token,user: {email:user.email}});
});

export default router;