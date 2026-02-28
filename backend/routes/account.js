const express=require('express')
const router=express.Router();
const authMiddleware=require('../middleware')
const{User,connectDb,Accounts}= require('../db');
const { default: mongoose } = require('mongoose');
router.get('/balance',authMiddleware,async (req,res)=>{
    const account= await Accounts.findOne({
        userId:req.userId,

    })
return res.status(200).json({
    balance:account.balance,
    firstName:account.firstName
})

})


// transfering the money to a friend endpoint

router.post('/transfer',authMiddleware,async(req,res)=>{
    //sending amount and recievers user Id
    const {samount,to}=req.body;
    
   
    //sending account
    const Sendingaccount=await Accounts.findOne({
        userId:req.userId
    })
    if(!Sendingaccount||Sendingaccount.balance<samount){
     
      return res.status(400).json({message:"Insufficient Balance"});
    }
    //reecieving account 
    const receivingAccount=await Accounts.findOne({
        userId:to
    })
   if(!receivingAccount){
    
    return res.status(400).json({message:"Invalid account "})
   }

   //everything is fine now send the money 
   try {
    await Accounts.updateOne({ userId: req.userId }, { "$inc": { balance: -samount } });
} catch (error) {
    console.error('Error while updating sender account:', error);
    return res.status(500).json({ message: 'Error updating sender account' });
}
//receive the money 
try {
    await Accounts.updateOne({ userId: to }, { "$inc": { balance: samount } });
} catch (error) {
    console.error('Error while updating receiver account:', error);
    return res.status(500).json({ message: 'Error updating receiver account' });
}
res.status(200).json({
    message:"Money Transaction is successful"
})

})



module.exports=router;
