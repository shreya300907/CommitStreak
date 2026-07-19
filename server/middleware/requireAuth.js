import jwt from 'jsonwebtoken';

export default function requireAuth(req,res,next){
    const authHeader= req.headers.authorization;
    const token=authHeader.split(' ')[1];
    if(!token){
        return res.status(401).json({error: "Unauthorised"});
    }
    try{
        const payload= jwt.verify(token, process.env.AUTH_SHARED_SECRET);
        req.user=payload;
        next();
    }catch{
        res.status(401).json({error: 'Invalid or expired token'});
    }
}