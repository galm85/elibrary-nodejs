require('../models/Database.model');
const Category = require('../models/Categorie.model');
const Book = require('../models/Book.model');






exports.home = async(req,res)=>{
    
    try {
        const categories = await Category.find({}).limit(8);
        const popular = await Book.find({}).sort({rank:-1}).limit(5);
        const newBooks = await Book.find({}).sort({createdAt:-1}).limit(5);
        res.render('pages/home',{title:'E-library | Home Page',categories,popular,newBooks,user});
    } catch (error) {
        return res.status(500).send({message:error.message || 'error'});
    }
}


exports.getAllCategories = async (req,res)=>{
    try {
        const categories = await Category.find({});
        res.render('pages/categories',{title:'E-library | Genere',categories});
    } catch (error) {
        
    }
}


exports.category = async(req,res)=>{
    try{
        categoryTitle = req.params.categoryTitle.replace(/-/g,' ');
        let category = await Category.findOne({name:categoryTitle});     
        let books = await Book.find({categoryId:category._id});
        
        res.render('pages/category',{title:`E-library | ${category.name.toUpperCase()}`,category,books})
    }catch(error){
        return res.status(500).send({message:error.message || 'error'});

    }
}


exports.bookById = async(req,res)=>{
    try {
        let book = await Book.findOne({_id:req.params.bookId});
        let category = await Category.findById(book.categoryId)
        res.render('pages/book',{title:`E-library | ${book.title}`,book,category})
    } catch (error) {
        return res.status(500).send({message:error.message || 'error'});
    }
}




exports.getNewBooks = async(req,res)=>{
    try {
        const books = await Book.find({}).sort({createdAt:-1}).limit(18);
        res.render('pages/newBooks',{title:"E-Library | New Books",books});
    } catch (error) {
        return res.status(500).send({message:error.message || 'error'});

    }
}


exports.getMostPopular = async(req,res)=>{
    try {
        const books = await Book.find({}).sort({rank:-1}).limit(18);
        res.render('pages/mostPopular',{title:"E-Library | Most Popular",books});
    } catch (error) {
        return res.status(500).send({message:error.message || 'error'});

    }
}



exports.search = async(req,res)=>{
    let search = req.query.search;
   
    try {
        // const books = await Book.find({title:{ $regex: new RegExp(search, 'i') }});
         const books = await Book.find({$or:[{title:{$regex: new RegExp(search, 'i')}},{author:{$regex: new RegExp(search, 'i')}}]});
        res.render('pages/searchResults',{title:"E-Library | Search",books,search});
    } catch (error) {
        return res.status(500).send({message:error.message || 'error'});

    }
}  
    


exports.random = async(req,res)=>{
     
    try {
        let count = await Book.find().countDocuments();
        let random = Math.floor(Math.random()*count);
        const book = await Book.findOne().skip(random).exec();
       const category = await Category.findById(book.categoryId);
        res.render('pages/book',{title:`E-Library | ${book.title}`,book,category});
    } catch (error) {
        return res.status(500).send({message:error.message || 'error'});

    }
}



exports.bestBook = async(req,res)=>{
    try{
        const books = await Book.find({}).sort({rank:-1}).limit(1);
        const book = books[0];
        const category = await Category.findById(book.categoryId);
        res.render('pages/book',{title:`E-Library | ${book.title}`,book,category});

    }catch(error){
        return res.status(500).send({message:error.message || 'error'});

    }
}
