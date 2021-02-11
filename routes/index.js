var express = require('express');
var router = express.Router();

// Create custom homepage
// --------------------------------------------------
router.get('/', function(req, res, next) {
    var masseage = null;

  res.render('index.ejs',{masseage})
});
// --------------------------------------------------

module.exports = router;