const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const jwtKey = 'elibrary';

const userSchema = new mongoose.Schema({
    firstName:{type:String,required:"First name is requierd"},
    lastName:{type:String,required:"Last name is requierd"},
    email:{type:String,required:"Email is requierd"},
    password:{type:String,required:"password is requierd"},
    phone:{type:String,required:"Phone is requierd"},
    address:{type:String,required:"Address is requierd"},
    image:{type:String},
    isAdmin:{type:Boolean,default:false},
},{timestamps:true});

userSchema.index({email:'text'});

userSchema.methods.renderToken = function(){
    const token = jwt.sign({
        firstName:this.firstName,
        lastName:this.lastName,
        email:this.email,
        image:this.image,
        isAdmin:this.isAdmin,
    },jwtKey);
    return token;
}

module.exports = mongoose.model('User',userSchema);