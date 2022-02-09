const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    name:{type:String,required:'This Field is Requierd'},
    color:{type:String,required:'This Field is Requierd'},
},{timestamps:true});

module.exports = mongoose.model('Categorie',categorySchema);