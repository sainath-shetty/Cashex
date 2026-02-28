//mongodb+srv://sainath18:sainath1234@cluster0.jptqrfm.mongodb.net/auth

const mongoose = require('mongoose');
const { Schema } = require('zod');


//establishing the connection between database and our app
console.log('Trying to connect to the database...'); // Log before connection attempt

async function connectDb() {
    try {
        const uri = process.env.MONGO_URI
        await mongoose.connect(uri);
        console.log('database connected');
    }
    catch (error) {
        console.log("error  occured while connectign to database: ", error.message);
    }
}

// creeating user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30,
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 20
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 20
    }
});
//creating a model which holds these schema
const User = mongoose.model('User', userSchema);

//creating a accounttabel schema
const accountSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    balance:{
        type:Number,
        required:true,
    },
    firstName:{
        type:String,
        required:true,
    }
});
const Accounts=mongoose.model('Accounts',accountSchema);

module.exports = {
    User,
    connectDb,
    Accounts
}