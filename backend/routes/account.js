const express=require("express");
const { authMiddleware } = require("../Middleware/auth");
const { Accountdb } = require("../db");
const { default: mongoose } = require("mongoose");
const router=express.Router();

router.get('/balance',authMiddleware,async(req,res)=>{
    try {
        const userId=req.userId;
        const {balance}=await Accountdb.findOne({userId});

        res.status(200).json({
            userId,
            balance
        })
        
    } catch (error) {
        res.status(500).json({
            message: "Error while get balance"
        });
    }
})

router.post('/transfer', authMiddleware, async (req, res) => {
    // console.log(req.userId);
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { amount, to} = req.body;
        const from=req.userId;

        const account = await Accountdb.findOne({ userId: from }).session(session);
        if (!account ||!amount || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ 
                message: "Insufficient balance",
                error:true,
                success:false

             });
        }

        const toAccount = await Accountdb.findOne({ userId: to }).session(session);
        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({ 
                message: "Invalid account",
                error:true,
                success:false });
        }

        // Perform the transfer in a single bulkWrite operation
        await Accountdb.bulkWrite([
            {
                updateOne: {
                    filter: { userId: from },
                    update: { $inc: { balance: -amount } },
                    session
                }
            },
            {
                updateOne: {
                    filter: { userId: to },
                    update: { $inc: { balance: amount } },
                    session
                }
            }
        ]);

        // Commit the transaction
        await session.commitTransaction();
        res.json({ message: "Transfer successful",
                error:false,
                success:true
         });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "Error while transferring",error:true,
        success:false });
    } finally {
        session.endSession();
    }
});


module.exports=router;