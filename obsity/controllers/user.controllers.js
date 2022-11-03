const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const validationResult = require('express-validator').validationResult;


let DB_URL = "mongodb+srv://ayman:lvpfh1246@cluster0.mlbuu0u.mongodb.net/obesity?retryWrites=true&w=majority";

module.exports = {

    getSignUp: (req, res, next) => {
        res.render('signup', {
            userId: req.session.userId,
            isAdmin: req.session.isAdmin,
            success_createSchool: req.flash('success_createSchool'),
            error_createSchool: req.flash('error_createSchool'),
            error_school: req.flash('error_school')
        });
    },


    signUp: (req, res) => {
        mongoose.connect(DB_URL, async () => {
            //bring data from body and hashed a password
            let { schoolName, location, gender, username, email, password } = req.body;
            if(validationResult(req).isEmpty()){
           
                try {
                    password = await bcrypt.hash(password, 10);

                    const user = await new User({
                        schoolName,
                        location,
                        gender,
                        username,
                        email,
                        password
                    });
                    await user.save();
        
                    if (user.save()) {
                        req.flash('success_createSchool', "تم إضافة المدرسة")
                        mongoose.disconnect(DB_URL);
                        res.redirect("/signup");
                    }
                } catch (error) {
                req.flash('error_school', "اسم المشرف مستعمل")
                mongoose.disconnect(DB_URL);
                res.redirect("/signup");
                }
        }
        else{
            req.flash('error_createSchool', validationResult(req).array())
            mongoose.disconnect(DB_URL);
            res.redirect("/signup");
        }
           
        });
    },




    getlogIn: (req, res, next) => {
        res.render("login.ejs", { error_password: req.flash('error_password') , error_notUser: req.flash('error_notUser') });
    },

    logIn: (req, res, next) => {
        mongoose.connect(DB_URL, async () => {
            let { username, password } = req.body;
            const user = await User.findOne({ username });

            if (user) {
                try {
                    const hashed = bcrypt.compareSync(password, user.password);
                    if (hashed) {
                        req.session.school = user.schoolName;
                        req.session.gender = user.gender;
                        req.session.userId = user._id;
                        req.session.isAdmin = user.isAdmin;
                        mongoose.disconnect(DB_URL);
                        if (!req.session.isAdmin) {
                            return res.redirect("/record");
                        } else {
                            return res.redirect("/signup");
                        }
                    } else {
                        
                        req.flash('error_password', "الرمز غير صحيح")
                        mongoose.disconnect(DB_URL);
                        return res.redirect("/login");
                    }
                }
                catch (error) {
                    mongoose.disconnect(DB_URL);
                    console.log(error);
                }
            }
            else {
                req.flash('error_notUser', "لا يوجد مستخدم بهذا الأسم")
                mongoose.disconnect(DB_URL);
                return res.redirect("/login");
            }
        });
    },




    logout: (req, res, next) => {
        req.session.destroy();
        res.redirect("/login");
    },
};
