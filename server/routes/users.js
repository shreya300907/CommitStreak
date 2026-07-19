import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import User from '../models/User.js';

const router= express.Router();
router.use(requireAuth);

router.get('/me',async(req,res)=>{
    const user= await User.findById(req.user.user_id);
    res.json(user);
})

router.patch('/me',async(req,res)=>{
    const user=await User.findByIdAndUpdate(req.user.user_id, req.body, {new:true} );
    res.json(user);
})
export default router;