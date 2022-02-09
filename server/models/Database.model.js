const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});



const db = mongoose.connection;
db.on('error',console.error.bind(console,"connection Error"));
db.once('open',()=>{
    console.log('Connected to MongoDB');
});



require('./Book.model');
require('./Categorie.model');
require('./Rent.model');
require('./user.model');