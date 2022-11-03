const mongoose = require('mongoose');

const {Schema} = mongoose;

const userSchema = new Schema({
    schoolName : {type: String, require: true} ,
    location : {type: String, require: true},
    gender : {type: String, require: true},
    username: {type: String, require: true, unique: true},
    email: {type: String, require: true},
    password: {type: String, require: true},
    isAdmin: {
        type: Boolean,
        default: false
    },
    thinnest : {type : Number },
    naturalWeight :{type : Number },
    overWeight : {type : Number },
    obesity : {type : Number },
    thinnestPercent : {type : String },
    obesityPercent : {type : String },
});



const User = mongoose.model('user', userSchema);
module.exports = User;

