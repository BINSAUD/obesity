//dependencies
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash')
const cookieParser = require('cookie-parser');


const methodOverride = require('method-override');

const app = express();

//routes
const userRouter = require('./routes/user.route')
const studentRouter = require('./routes/student.route')

//middlewares
app.set("view engine", "ejs");
app.set("views", "views");
app.set(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({
    secret: "ashhh",
    resave : false,
    saveUninitialized: false,
    cookie: {maxAge: new Date() * 60}
}))

app.use(cookieParser("ashhh"))








app.use(methodOverride('_method', { methods: ["POST", 'GET'] }));
app.use(flash());


app.use('/', userRouter);
app.use('/', studentRouter);



//
app.get("/error", (req, res, next) => {
    res.status(500); // error on server
    res.render("error.ejs", {
        userId: req.session.userId,
        isAdmin: req.session.isAdmin,
    });
});

// لما تكون غير مسؤول و تدخل لصفحة من صفحات المسؤولين
app.get("/not-admin", (req, res, next) => {
    res.status(403); // not admin status code 403
    res.render("not-admin", {
        userId: req.session.userId,
        isAdmin: false,
        
    });
});
app.get("/not-user", (req, res, next) => {
    res.status(408); // not user status code 408
    res.render("not-user", {
        userId: req.session.userId,
        isAdmin: true,
        
    });
});

// إذا الصفحة غير موجودة
app.use((req, res, next) => {
    res.status(404); // error page not found status code 404
    res.render("not-found", {
        userId: req.session.userId,
        isAdmin: req.session.isAdmin,
        
    });
});





const port = process.env.PORT || 3030;
//port
app.listen(port, ()=>{
    console.log(`listen on port ${port}`)
})