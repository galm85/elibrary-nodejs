const router = require("express").Router();
const usersController = require('../controllers/users.controller');


router.get('/register',usersController.getRegister);
router.post('/register',usersController.postRegister);
router.get('/login',usersController.getLogin);
router.post('/login',usersController.postLogin);
router.get('/logout',usersController.logout);
router.get('/rent-book/:bookId',usersController.getRentBook);
router.post('/rent-book',usersController.postRentBook);
router.get('/return-book',usersController.getReturnBook);
router.post('/return-book',usersController.postReturnBook);

module.exports = router;

