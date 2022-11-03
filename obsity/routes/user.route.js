const express = require('express');
const router = express.Router();
const check = require('express-validator').check;
const auth = require('../controllers/user.controllers') ;
const authGuard = require('./guards/auth.guard.user');
const adminGuard = require('./guards/auth.Admin');




router.get('/signup',adminGuard.isAdmin, auth.getSignUp);

router.post('/signup',adminGuard.isAdmin,
check('schoolName').notEmpty().withMessage('اسم المدرسة فارغ'),
check('location').notEmpty().withMessage('موقع المدرسة فارغ'),
check('gender').notEmpty().withMessage('اسم المدرسة فارغ'),
check('username').notEmpty().withMessage('اسم المشرف فارغ'),
check('email').notEmpty().withMessage("البريد الإلكتروني فارغ").isEmail().withMessage("يجب ان يكون تنسيق البريد الإلكتروني صحيح"),
check('password').notEmpty().withMessage("الرمز فارغ").isLength({min : 5}).withMessage("اقل قيمة 5 احرف او ارقام")

, auth.signUp);




router.get('/login',authGuard.notAuth , auth.getlogIn);
router.post('/login',authGuard.notAuth , auth.logIn);





router.post('/logout',authGuard.isAuth , auth.logout);



module.exports = router;
