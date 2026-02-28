const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware');
const zod = require('zod');
const { User, connectDb, Accounts } = require('../db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;
const bcrypt = require("bcrypt");


//creation of zod object
const signUpbody = zod.object({
    username: zod.string().email().min(5).max(30),
    firstName: zod.string().min(3).max(20),
    lastName: zod.string().min(3).max(20),
    password: zod.string().min(3).max(20)
})
//creating the post request for signup to request send the post request to /app/v1/user/signup

router.post('/signup', async (req, res) => {
    console.log(req.headers.authorization);
    //check if the req.body is same axs the specified zod

    const result = signUpbody.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Invalid credentials",
            errors: result.error.errors, // Include detailed validation errors
        });
    }

    //check if the user is already exisiting
    const existingUser = await User.findOne({
        username: req.body.username
    })
    if (existingUser) {
        return res.status(411).json({
            message: "the username is already existing "
        })
    }
    //if user is not already existing then create one 
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hashedPassword,
    })

    const userId = user._id;
    //initialized balance for every user whois is signed up

    try {
        const account = await Accounts.create({
            userId,
            balance: 1 + Math.random() * 1000,
            firstName: req.body.firstName
        })
        console.log("account created ", account);
    }

    catch (error) {
        return res.json({ error: error.message })
    }
    const token = jwt.sign({
        userId
    }, jwtSecretKey);
    res.json({
        message: "User created successfully",
        token: token
    })



});



//design a zod body for signin

const signinBody = zod.object({
    username: zod.string().email().min(3),
    password: zod.string().min(8)
});

// creating a post request for signin to request send the post request to /app/v1/user/signin
router.post('/signin', async (req, res) => {
    try {
        const result = signinBody.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ message: "Invalid inputs" });
        }

        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, jwtSecretKey);
        return res.status(200).json({ message: "User signed in successfully", token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


//update the user 

const updateBody = zod.object({

    password: zod.string().optional(),
    lastName: zod.string().optional(),
    firstName: zod.string().optional()
})
router.put('/update', authMiddleware, async (req, res) => {
    const result = updateBody.safeParse(req.body);
    if (!result.success) {
        return res.status(411).json({
            message: " invalid credentials given for update "
        })
    }
    await User.updateOne({ _id: req.userId }, req.body);
    res.json({
        message: "Updated the personal credendentialssuccessfully"
    })

})

//To seaerch the users we have to create a enpoint 

router.get("/bulk", async (req, res) => {

    const filter = req.query.filter || "";
    //search in the database

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter,
                "$options": "i"  // Makes the search case-insensitive
            }
        }, {
            lastName: {
                "$regex": filter,
                "$options": "i"  // Makes the search case-insensitive
            }
        }
        ]
    })

    res.json({
        user: users.map(user => ({
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})




module.exports = router;