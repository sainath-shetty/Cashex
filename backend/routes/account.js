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

router.post('/transfer', authMiddleware, async (req, res) => {
    const { samount, to } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const sendingAccount = await Accounts.findOne({ userId: req.userId }).session(session);
        if (!sendingAccount || sendingAccount.balance < samount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient Balance" });
        }

        const receivingAccount = await Accounts.findOne({ userId: to }).session(session);
        if (!receivingAccount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid account" });
        }

        await Accounts.updateOne({ userId: req.userId }, { "$inc": { balance: -samount } }, { session });
        await Accounts.updateOne({ userId: to }, { "$inc": { balance: samount } }, { session });

        await session.commitTransaction();
        res.status(200).json({ message: "Money Transaction is successful" });
    } catch (error) {
        await session.abortTransaction();
        console.error('Transaction failed:', error);
        res.status(500).json({ message: 'Transaction failed, no money was moved' });
    } finally {
        session.endSession();
    }
})



module.exports=router;
