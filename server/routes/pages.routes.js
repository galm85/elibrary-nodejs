const router = require("express").Router();
const pagesController = require('../controllers/pages.controller');




router.get('/',pagesController.home);
router.get('/categories/:categoryTitle',pagesController.category);
router.get('/books/:bookId',pagesController.bookById);
router.get('/categories',pagesController.getAllCategories);
router.get('/new-books',pagesController.getNewBooks);
router.get('/most-popular',pagesController.getMostPopular);
router.get('/search',pagesController.search);
router.get('/explore-random',pagesController.random);
router.get('/explore-latest',pagesController.bestBook);

module.exports = router;