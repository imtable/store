var express = require('express');
const multer = require('multer');

const categoriesCtrl = require('../controllers/categoriesCtrl');
const commentsCtrl = require('../controllers/commentsCtrl');
const itemsCtrl = require('../controllers/itemsCtrl');
const authCtrl = require('../controllers/auth');

// const identifyMw = require('../mw/identifyMw');

var router = express.Router();
const upload = multer();

// router.all('/*', identifyMw);

router.get('/', async function(req, res, next) {
  res.render('index');
});

router.get('/homePage', async function(req, res, next) {
  const categories = await categoriesCtrl.getCategories();
  const items = await itemsCtrl.getItems();
  res.send({ categories, items } );
});

router.post('/items/:id/getComments', async function(req, res, next) {
  const id = req.params.id;
  const data = await commentsCtrl.getCommentsOfItem(id);
  res.send(data);
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
  const data = await itemsCtrl.getItemById(id);
  res.send(data);
});

router.post('/getItemsByCat', async function(req, res, next) {
  const catId = req.body.catId;
  const categorie = await categoriesCtrl.getCategorieByID(catId);
  if (!categorie.payload) {
    res.send({ categorie } );
    return;
  }
  const data = await itemsCtrl.getItemsByCategorieId(categorie.payload.id);
  res.send(data);
});

// _auth
router.post('/userIdentify', upload.none(), async function(req, res, next) {
  const jwtToken = req.body.jwtToken;
  if (!jwtToken) { res.send({ status: 'identify error: no token in route' }); return; }
  
  const identifyStatus = await authCtrl.identifyUser(jwtToken);

  res.send(identifyStatus);
});

router.post('/userReg', upload.none(), async function(req, res) {
  const login = req.body.userForm_login, pwd = req.body.userForm_pwd, name = req.body.userForm_name;
  
  const user = await authCtrl.registerUser(login, pwd, name);
  if (!user.payload) {
    res.json(user);
    return;
  }
  console.log('* * * * new user:', user.payload.login);
  res.json({ status: user.status });
});

router.post('/userLogin', upload.none(), async function(req, res) {
  const login = req.body.userForm_login, pwd = req.body.userForm_pwd;
  const user = await authCtrl.loginUser(login, pwd);

  res.json(user);
});

// router.get('/userLogout', async function(req, res, next) {
//   const userName = req.dearUser.payload.profile.name;
//   delete(req.session.userID);
//   if (!req.session.userID) {
//     console.log(`user ${userName} is logout`);
//     res.json({ status: `user ${userName} logout success` });
//   }
// });
// auth_

module.exports = router;