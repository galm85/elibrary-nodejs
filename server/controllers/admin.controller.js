require('../models/Database.model');
const Category = require('../models/Categorie.model');
const Book = require('../models/Book.model');
const Rent = require('../models/Rent.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;




exports.adminPanel = async (req,res)=>{
    try{
        res.render('admin/adminPanel',{title:'E-library | Admin Panel'})
    }catch(error){
        return res.status(500).send({message:error.message || 'error'}); 
    }
}



// ================== Books ===============================

exports.adminBooks = async (req,res)=>{
    let search = 'undefined'
    try{
        const books = await Book.aggregate([{
                $lookup:{
                    from:'categories',
                    localField:'categoryId',
                    foreignField:'_id',
                    as:'category'
                }
            }]).sort({createdAt:-1});
       
        res.render('admin/adminBooks',{title:'E-library | Admin Books',books,search})
    }catch(error){
        return res.status(500).send({message:error.message || 'error'}); 
    }
}


exports.getAddBook = async(req,res)=>{

    try {
        const categories = await Category.find({});
        res.render('admin/addBook',{title:'E-library | Admin - Add Book',categories});
    } catch (error) {
        return res.status(500).send({message:error.message || 'error'});
    }
}


exports.postAddBook = async(req,res)=>{
    try{
        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if(!req.files || Object.keys(req.files).length === 0){
            newImageName = 'noImage.png';
        }else{
            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;
            uploadPath = require('path').resolve('./')+'/public/uploads/books/'+newImageName;
            imageUploadFile.mv(uploadPath,(err)=>{
                if(err) return res.status(500).send(err);
            })
        }


        const newBook = new Book({
            title:req.body.title,
            categoryId:req.body.categoryId,
            summary:req.body.summary,
            author:req.body.author,
            rank:req.body.rank,
            pages:req.body.pages,
            image:newImageName,
            available:true,
        })

        await newBook.save();
        
        res.redirect('/admin/books');
    }catch(error){
        return res.status(500).send({message:error.message || 'error'});

    }
}


exports.deleteBook = async(req,res)=>{
    
   try{
    await Book.findByIdAndRemove(req.params.bookId);
    return res.status(200).send('Book Deleted');
    
   }catch(err){
    return res.status(500).send({message:error.message || 'error'}); 
   }
}


exports.getEditBook = async(req,res)=>{
    try{
        const categories = await Category.find({});
        const book = await Book.findById(req.params.bookId);
        res.render('admin/editBook',{title:'E-library | Admin - Edit Book',book,categories})
        
       }catch(err){
        return res.status(500).send({message:error.message || 'error'}); 
       }
}


exports.postEditBook = async(req,res)=>{

    // return res.json(req.body);

    try{

        const bookId = req.params.bookId;

        const updateBook =  ({
            title:req.body.title,
            categoryId:req.body.categoryId,
            summary:req.body.summary,
            author:req.body.author,
            rank:req.body.rank,
            pages:req.body.pages,
            available:true,
        })


        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if(req.files){
          
            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;
            uploadPath = require('path').resolve('./')+'/public/uploads/books/'+newImageName;
            imageUploadFile.mv(uploadPath,(err)=>{
                if(err) return res.status(500).send(err);
            })
        
            updateBook.image = newImageName;
        }

        

        await Book.findByIdAndUpdate(bookId,updateBook);
        res.redirect('/admin/books');
    }catch(error){
        return res.status(500).send({message:error.message || 'error'});

    }
}



exports.getSearchBook = async(req,res)=>{
    let search = req.query.search;
   
    try {
        // const books = await Book.find({$or:[{title:{$regex: new RegExp(search, 'i')}},{author:{$regex: new RegExp(search, 'i')}}]});
        const books = await Book.aggregate([
            {
                $match:{$or:[{title:{$regex: new RegExp(search, 'i')}},{author:{$regex: new RegExp(search, 'i')}}]}
            },
            {
                $lookup:{
                    from:'categories',
                    localField:'categoryId',
                    foreignField:'_id',
                    as:'category'
                    }
            }

        ]).sort({createdAt:-1});
        res.render('admin/adminBooks',{title:"E-Library | Admin Books",books,search});
    } catch (error) {
        return res.status(500).send({message:error.message || 'error'});

    }
}  





// ================== Rents ===============================

exports.getAllRents = async(req,res)=>{
   
    try {
        
        const rents = await Rent.aggregate([
        {
            $lookup:{
                from:'books',
                localField:'bookId',
                foreignField:'_id',
                as:'book'
            }
        },
        {
            $lookup:{
                from:'users',
                localField:'userId',
                foreignField:'_id',
                as:'user',
            }
        }  
        ]).sort({createdAt:-1});

        
        // res.json(rents);
         res.render('admin/adminRents',{title:'E-Library | Admin Rants',rents})

    } catch (error) {
        
    }
}


exports.getSingleRent = async(req,res)=>{
    try {
        
        const rents = await Rent.aggregate([
            {
                $match: { _id: ObjectId(req.params.rentId) }
            },
        {
            $lookup:{
                from:'books',
                localField:'bookId',
                foreignField:'_id',
                as:'book'
            }
        },
        {
            $lookup:{
                from:'users',
                localField:'userId',
                foreignField:'_id',
                as:'user',
            }
        },  
        ])

        
        const rent = rents[0];
       res.render('admin/adminSingleRent',{title:'E-Library | Admin Rants',rent})

    } catch (error) {
        console.log(error);
    }
}






// ================== Categories ===============================

exports.adminCategories = async(req,res)=>{
    try {
        const categories = await Category.find({});
        res.render('admin/adminCategories',{title:'E-Library | Admin Categories',categories});
    } catch (error) {
        console.log(error);
    }
}


exports.getAddCategory = async(req,res)=>{
    try {
       
        res.render('admin/addCategory',{title:'E-Library | Admin Add Category'});
    } catch (error) {
        console.log(error);
    }
}


exports.postAddCategory = async(req,res)=>{
    try {
       
        const category = new Category({
            name:req.body.name,
            color:req.body.color,
        })

        await category.save();

        res.redirect('/admin/categories');
    } catch (error) {
        console.log(error);
    }
}


exports.getEditCategory = async(req,res)=>{
    try {
        const category = await Category.findById(req.params.categoryId);
        res.render('admin/editcategory',{title:'E-Library | Admin Edit Category',category});
    } catch (error) {
        console.log(error);
    }
}


exports.postEditCategory = async(req,res)=>{
    try {
       
        const updateCategory = req.body;
        await Category.findByIdAndUpdate(req.params.categoryId,updateCategory);
        res.redirect('/admin/categories');
    } catch (error) {
        console.log(error);
    }
}


exports.deleteCategory = async(req,res)=>{

    try {
        await Category.findByIdAndRemove(req.params.categoryId);
        res.status(200).send('Category Deleted');
    } catch (error) {
        console.log(error)       
    }
}





// ================== Users ===============================

exports.adminUsers = async(req,res)=>{
    
    let search = 'undefined';
    const users = await User.find({});
    res.render('admin/adminUsers',{title:'E-library | Admin Users',users,search});

}


exports.getSearchUser = async(req,res)=>{
    let search = req.query.search;
   
    try {
        const users = await User.find({$or:[{firstName:{$regex: new RegExp(search, 'i')}},{lastName:{$regex: new RegExp(search, 'i')}}]}).sort({createdAt:-1});
        res.render('admin/adminUsers',{title:"E-Library | Admin Books",users,search});
    } catch (error) {
        return res.status(500).send({message:error.message || 'error'});

    }
}  