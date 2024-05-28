const express=require('express');
const router=express.Router();
const zod=require('zod');
const jwt=require('jsonwebtoken');
const { Userdb, Accountdb } = require('../db');
const {JWT_SECRET}=require('../config');
const { authMiddleware } = require('../Middleware/auth');

const UserSignupSchema=zod.object({
    userId:zod.string().min(3).max(30),
    userName:zod.string().max(30),
    email:zod.string().email(),
    password:zod.string().min(8)
});

const signinBody = zod.object({
    userId_Email: zod.string(),
	password: zod.string()
})

const updateBody=zod.object({
    userName:zod.string().max(30),
    password:zod.string().min(8)
})


router.get('/',(req,rep)=>{
    rep.send("HEsafaslo");
})


//-Create user Account
router.post('/signup',async(req,res)=>{
    try {
        const { userId, userName, email, password } = req.body;

        const userDetail = { userId, userName, email, password };
        const userValidation = UserSignupSchema.safeParse(userDetail);

        if (!userValidation.success) {
            return res.status(400).json({ error: userValidation.error });
        }

        const existingUser = await Userdb.findOne({
            $or: [{ email }, { userId }]
        });

        if (existingUser) {
            const errorMessage = existingUser.email === email ? "Email already exists" : "UserID already exists";
            return res.status(409).json(
                { 
                    message: errorMessage,
                    error: true,
                    success:false,

            });
        }

        const newUser = new Userdb(userDetail);
        await newUser.save();

        const balance= 1+Math.random()*10000;
        const newAccount=new Accountdb({
            userId,
            balance
        });
        await newAccount.save();

        const token=jwt.sign({userId},JWT_SECRET);

        res.status(201).json({
            message: `User ${userId} created successfully with balance: ${balance}`,
            error: false,
            success:true,
        });
    } catch (error) {
        res.status(500).json({
            message: `Error while signup ${error}`,
            error: true,
            success:false,
        });
    }   

    
})


//-Login
router.post('/signin',async(req,res)=>{
    try {
        const {userId_Email,password}=req.body;

        const { success } = signinBody.safeParse(req.body)
        if (!success) {
            return res.status(411).json({
                message: "Incorrect inputs",
                success:false,
                error:true
            })
        }
    
        
        const existingUser = await Userdb.findOne({
            $or: [{ email:userId_Email }, { userId:userId_Email }],
            password
        });

        if(!existingUser){
           return res.status(411).json({
            message: "User do not exist",
            success:false,
            error:true

        })
        }

        const token=jwt.sign({userId:existingUser.userId},JWT_SECRET);

        return res.status(200).json({
            token,
            message: "Success",
            success:true,
            error:false,
            userName:existingUser.userName
        });

    } catch (error) {
        res.status(500).json({
            message: "Error while logging in",
            success:false,
            error:true
        }); 
    }

})

//-update user
router.put("/",authMiddleware,async(req,res)=>{
 
    try {
        const userId=req.userId;
        const {userName,password}=req.body;
        const updateDetail={
            userName,
            password
        }
        const userValidation=updateBody.safeParse(updateDetail);
        if (!userValidation.success) {
            return res.status(400).json({ error: userValidation.error });
        }
        await Userdb.updateOne({userId},updateDetail);

        res.status(200).json({
            message: "Updated successfully"
        });
        
    } catch (error) {
        res.status(500).json({
            message: "Error while updating information"
        }); 
    }

})


//-Search user
router.get('/bulk',async(req,res)=>{
    try {
        const userName=req.query.filter || "";  // http://localhost:3000/user/bulk/?filter=userName
        const userId=req.userId;
        // console.log(userId);
        
        const filterUser=await Userdb.find({userName:
                                        {
                                            $regex:userName,
                                            $options:'i'
                                        }
                                        });
        const filterMe=filterUser.filter(user=>user.userId!=userId);

        res.status(200).json({
           filterUser:filterMe.map(user=>{
            return {
                name:user.userName,
                id:user.userId
            }
           })
        });
        
    } catch (error) {
         res.status(500).json({
            message: "Error while filtering information",
            success:false,
            error:true
        }); 
    }
})







module.exports=router;