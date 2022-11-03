const mongoose = require('mongoose');

const {Schema} = mongoose;

const studentSchema = Schema({
    userId : {type: Schema.Types.ObjectId , ref: 'user' ,require: true},//المشرف
    name :{type: String, require: true} ,
    age : {type: Number, require: true , min: 5, max: 19},
    gender : {type: String, require: true},
    hight : {type: Number, require: true},
    weghit : {type: Number, require: true},
    bloc : {type: Number, require: true},
    obesity : {type: String, require: true}
})



const Student = mongoose.model('student', studentSchema);
module.exports = Student;