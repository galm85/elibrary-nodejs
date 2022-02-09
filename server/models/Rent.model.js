const mongoose = require('mongoose');


const rentSchema = new mongoose.Schema({
    bookId:{type:mongoose.Types.ObjectId},
    userId:{type:mongoose.Types.ObjectId},
    onRent:{type:Boolean}
},{timestamps:true});


// bookSchema.index({title:'text'});

module.exports = mongoose.model('Rent',rentSchema);