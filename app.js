const express = require('express');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const mongoDBSession = require('connect-mongodb-session')(session);
const cookieParser = require('cookie-parser');
const flash = require('flash');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4001;


const store = new mongoDBSession({
    uri:process.env.MONGO_URI,
    collection:'mySessions',
});






// middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(expressLayouts);
app.use(fileUpload());
app.use(cookieParser('LibrarySecure'));

app.use(session({
    secret:'LibrarySecretSession',
    saveUninitialized:false,
    resave:false,
    store:store
}));
app.use(flash());

// EJS layouts
app.set('layout','./layouts/master');
app.set('view engine','ejs');





// Routes
const pagesRoutes = require('./server/routes/pages.routes');
const adminRoutes = require('./server/routes/admin.routes');
const usersRoutes = require('./server/routes/users.routes');



// Autentication User
user = null;
const isAdmin = (req,res,next)=>{
 
    if(req.session.user && req.session.user.isAdmin){
        next()
    }else{
        res.redirect('/users/login');
    }
}

const getUser = async (req,res,next)=>{
    if( await req.session && req.session.user){
       global.user = req.session.user;
    }
    next();
}


app.use('/admin',isAdmin,adminRoutes);
app.use('/users',getUser,usersRoutes);
app.use('/',getUser,pagesRoutes)









app.listen(PORT,()=>console.log(`App is running on: http://localhost:${PORT}`));