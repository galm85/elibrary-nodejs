require('../models/Database.model');
const Category = require('../models/Categorie.model');
const Book = require('../models/Book.model');
const User = require('../models/user.model');
const Rent = require('../models/Rent.model');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');




exports.getRegister = async(req,res)=>{

    if(req.session.user){
        res.redirect('/');
    }

    try {
        res.render('users/register',{title:'E-library | Register'})

    } catch (error) {
        console.log(error)
    }
}



exports.postRegister = async(req,res)=>{



    try{
        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if(!req.files || Object.keys(req.files).length === 0){
            newImageName = 'noUser.png';
        }else{
            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;
            uploadPath = require('path').resolve('./')+'/public/uploads/users/'+newImageName;
            imageUploadFile.mv(uploadPath,(err)=>{
                if(err) return res.status(500).send(err);
            })
        }

        const salt = await bcrypt.genSalt(10);

        const hashPassword  = await bcrypt.hash(req.body.password,salt);


        const user = new User({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            password:hashPassword,
            phone:req.body.phone,
            address:req.body.address,
            image:newImageName,
            isAdmin:false
        })

        await user.save();
        
        res.redirect('/');
    }catch(error){
        return res.status(500).send({message:error.message || 'error'});

    }
}




exports.getLogin = async(req,res)=>{
     if(req.session.user){
        res.redirect('/');
    }

    try {
        
        res.render('users/login',{title:'E-library | Login'})

    } catch (error) {
        console.log(error)
    }
}



exports.postLogin = async(req,res)=>{
    
    try {
        let user = await User.findOne({email:req.body.email});
        if(!user){
            return res.render('users/login',{title:'E-library | Login',error:'wrong Email or Password'});
        }

        const compare = await bcrypt.compare(req.body.password,user.password);
        if(!compare) return  res.render('users/login',{title:'E-library | Login',error:'wrong Email or Password'});

        const token = user.renderToken();
        req.session.user = user;
        req.session.isAdmin = true;
        res.redirect('/');
       
       

    } catch (error) {
        
    }


}



exports.logout = async(req,res)=>{
    req.session.destroy(err=>{
        if(err) throw err;
        global.user = null;
        res.redirect('/');
    })
}



exports.getRentBook = async(req,res)=>{

    if(!req.session.user){
        return redirect('/users/login');
    }


    let book = await Book.findById(req.params.bookId);
    let user = (req.session.user);
    
    
    res.render('users/rentBook',{title:'E-Library | Rent a Book',book,user});

    

}



exports.postRentBook = async(req,res)=>{
    
   

    const newRent = new Rent({
        bookId:req.body.bookId,
        userId:req.body.userId,
        onRent:true,
    })

    await Book.findByIdAndUpdate(req.body.bookId,{$set:{available:false,userId:req.body.userId}});
    await newRent.save();
    

    res.send('Book rented');
}




exports.getReturnBook = async(req,res)=>{
    try {
        
        let user = req.session.user;
        const rents = await Rent.aggregate([
            {
                $match:{userId:mongoose.Types.ObjectId(user._id)},
            },
            
            {
                $lookup:{
                    from:'books',
                    localField:'bookId',
                    foreignField:'_id',
                    as:'book',
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
       
   
    res.render('users/rents',{title:'E-Library | My Rants',rents});


    } catch (error) {
        console.log(error);
    }
}


exports.postReturnBook = async(req,res)=>{
    try {
        
  
       
        await Book.findByIdAndUpdate(req.body.bookId,{$set:{userId:'',available:true}});
        await Rent.findByIdAndUpdate(req.body.rentId,{$set:{onRent:false}});
        res.status(200).send('The Book has Returned')

    } catch (error) {
        console.log(error);
    }
}