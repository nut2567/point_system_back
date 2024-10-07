var express = require('express');
var router = express.Router();
const { rewards, Product } = require('../mockData');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/Product', function(req, res) {
  res.json(Product);
});
module.exports = router;
