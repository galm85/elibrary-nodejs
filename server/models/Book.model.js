const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({
    title:{type:String,required:'This Field is Requierd'},
    categoryId:{type:mongoose.Types.ObjectId,required:'This Field is Requierd'},
    summary:{type:String,required:'This Field is Requierd'},
    author:{type:String,required:'This Field is Requierd'},
    rank:{type:Number,required:'This Field is Requierd'},
    pages:{type:Number,required:'This Field is Requierd'},
    image:{type:String,required:'This Field is Requierd'},
    available:{type:Boolean,default:false},
    userId:{type:String},
},{timestamps:true});


// bookSchema.index({title:'text'});

module.exports = mongoose.model('Book',bookSchema);