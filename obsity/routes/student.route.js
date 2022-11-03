const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller') ;
const authGuard = require('./guards/auth.guard.user');
const adminGuard = require('./guards/auth.Admin')


//user
//C
router.get('/', authGuard.isAuth ,adminGuard.notAdmin, studentController.studentPageGet);
router.post('/', authGuard.isAuth,adminGuard.notAdmin, studentController.studentPagePost);
//R
router.get('/record', authGuard.isAuth ,adminGuard.notAdmin, studentController.getRecord);
router.get('/s', authGuard.isAuth ,adminGuard.notAdmin, studentController.studentGetUD);
//U
router.get('/s/update/:id', authGuard.isAuth ,adminGuard.notAdmin, studentController.edit);
router.put('/s/update/:id', authGuard.isAuth ,adminGuard.notAdmin, studentController.update);
//D
router.delete('/s/delete/:id', authGuard.isAuth ,adminGuard.notAdmin, studentController.delete);



//admin
//R
router.get('/schools',adminGuard.isAdmin, studentController.schools);
//D
router.delete('/schools/:id',adminGuard.isAdmin, studentController.delateSchool);







module.exports = router;