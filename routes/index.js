var express = require('express');
const multer = require('multer');

const itemVersionsCtrl = require('../controllers/itemVersionsCtrl');
const categoriesCtrl = require('../controllers/categoriesCtrl');
const itemPicCtrl = require('../controllers/itemPicCtrl');
const itemsCtrl = require('../controllers/itemsCtrl');
const authCtrl = require('../controllers/authCtrl');

const identifyMw = require('../mw/identifyMw');

var router = express.Router();
const upload = multer();

router.all('/*', identifyMw);

router.get('/', async function(req, res, next) {
  res.render('index');
});

router.get('/homePage', async function(req, res, next) {
  const categories = await categoriesCtrl.getCategories();
  const items = await itemsCtrl.getItems();
  res.send({ categories, items } );
});

router.get('/getCats', async function(req, res, next) {
  const categories = await categoriesCtrl.getCategories();
  res.send(categories);
});

router.get('/items/*', async function(req, res, next) {
  res.render('item');
});

router.post('/items/:id/', async function(req, res, next) {
  const id = req.params.id;
  const data = await itemsCtrl.getItemByID(id);
  res.send(data);
});

router.post('/getItemsByCat', async function(req, res, next) {
  const catID = req.body.catID;
  const categorie = await categoriesCtrl.getCategorieByID(catID);
  if (!categorie.payload) {
    res.send({ categorie } );
    return;
  }
  const data = await itemsCtrl.getItemsByCategorieID(categorie.payload.id);
  res.send(data);
});

// _auth
router.get('/userIdentify', async function(req, res, next) {
  res.json(req.dearUser);
});

router.post('/userReg', upload.none(), async function(req, res) {
  const login = req.body.userForm_login, pwd = req.body.userForm_pwd, name = req.body.userForm_name;
  
  const user = await authCtrl.registerUser(login, pwd, name);
  if (!user.payload) {
    res.json(user);
    return;
  }
  console.log('* * * * new user:', user.payload.login);
  req.session.userID = user.payload.userID;
  res.json({ status: user.status });
});

router.post('/userLogin', upload.none(), async function(req, res) {
  const login = req.body.userForm_login, pwd = req.body.userForm_pwd;
  
  const user = await authCtrl.loginUser(login, pwd);
  if (!user.payload) {
    res.json(user);
    return;
  }
  req.session.userID = user.payload.profile.userID;
  res.json(user);
});

router.get('/userLogout', async function(req, res, next) {
  const userName = req.dearUser.payload.profile.name;
    delete(req.session.userID);
  if (!req.session.userID) {
    console.log(`user ${userName} is logout`);
    res.json({ status: `user ${userName} logout success` });
  }
});
// auth_

module.exports = router;