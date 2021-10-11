var express = require('express');
const multer = require('multer');

const itemsCtrl = require('../controllers/itemsCtrl');
const itemVersionsCtrl = require('../controllers/itemVersionsCtrl');
const categoriesCtrl = require('../controllers/categoriesCtrl');
const itemPicCtrl = require('../controllers/itemPicCtrl');

var router = express.Router();

const upload = multer();

router.get('/', async function(req, res, next) {
  res.render('acp', { title: 'acp' });
});

router.get('/getInitData', async function(req, res, next) {
  const categories = await categoriesCtrl.getCategories();
  res.send({ categories });
});

router.post('/postCat', upload.none(), async function(req, res) {
  console.log('req.body:', req.body);
  const name = req.body.name;

  const cat = await categoriesCtrl.createCategorie(name);
  res.json(cat);
});

router.post('/postItem', itemPicCtrl.uploadPic(), async function(req, res) {
  console.log('req.body:', req.body);
  const data = req.body;

  const itemId = await itemsCtrl.createItem(data);
  res.json({ status: 'ok', payload: { itemId } });
});

router.post('/postItemVersion', itemPicCtrl.uploadPic(), async function(req, res) {
  console.log('req.body:', req.body);
  const data = req.body;
  const itemId = data.itemId;

  const itemVersionId = await itemVersionsCtrl.createItemVersion(data);
  await itemsCtrl.updateItemVersions(itemId, itemVersionId);

  res.json({ status: 'ok', payload: { itemVersionId } });
});

module.exports = router;