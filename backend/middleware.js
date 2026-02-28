const jwt=require('jsonwebtoken');
require('dotenv').config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const authMiddleware=(req,res,next)=>
{
    const authHeader=req.headers.authorization;
    if(!authHeader ||!authHeader.startsWith('Bearer ')){
        return res.status(403).json({ message:"invalid token entry "});
    }
    const token=authHeader.split(' ')[1];
   
    try{
    const decoded=jwt.verify(token,jwtSecretKey);
    console.log(decoded)
    req.userId=decoded.userId;
    next();
    }
    catch(error)
    {
        return res.status(403).json({error:error.message})
    }
};
module.exports=authMiddleware;