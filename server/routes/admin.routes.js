const router = require("express").Router();
const adminController = require('../controllers/admin.controller');



router.get('/',adminController.adminPanel);
router.get('/books',adminController.adminBooks);
router.get('/add-book',adminController.getAddBook);
router.post('/add-book',adminController.postAddBook);
router.delete('/delete-book/:bookId',adminController.deleteBook);
router.get('/books/edit-book/:bookId',adminController.getEditBook);
router.post('/books/edit-book/:bookId',adminController.postEditBook);
router.get('/rents',adminController.getAllRents);
router.get('/rents/:rentId',adminController.getSingleRent);
router.get('/categories',adminController.adminCategories);
router.get('/add-category',adminController.getAddCategory);
router.post('/add-category',adminController.postAddCategory);
router.get('/categoires/edit-category/:categoryId',adminController.getEditCategory);
router.post('/categoires/edit-category/:categoryId',adminController.postEditCategory);
router.delete('/delete-category/:categoryId',adminController.deleteCategory);
router.get('/search-book',adminController.getSearchBook);
router.get('/users',adminController.adminUsers);
router.get('/search-user',adminController.getSearchUser);





module.exports = router;