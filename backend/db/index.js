const mongoose=require("mongoose");
const {mongoDB_URL}=require("../config");
const { number } = require("zod");

mongoose.connect(mongoDB_URL);

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected successfully!');
});
mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

const UserSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true, //- *mendatory
        // unique:true,  
        trim:true, //-No white Space in last or front
        lowercase:true,
        minLength:3,
        maxLength:30
    },
    userName:{
        type:String,
        required:true,
        trim:true,
        maxLength:30
    },
    email:{
        type:String,
        required:true,
        // unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength:8
    }
});

const Userdb=mongoose.model('User',UserSchema);

const accountSchema=new mongoose.Schema({
    userId:{
        type:String,
        ref:'User',
        required:true, //- *mendatory
    },
    balance:{
        type:Number,
        required:true
    }
})

const Accountdb=mongoose.model('Account',accountSchema);

module.exports={
    Userdb,
    Accountdb
};