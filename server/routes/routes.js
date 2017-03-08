var express = require('express');
var router = new express.Router();

// Require controllers
var PostCtrl = require('../controllers/post');
// router.get('/',function(req,res,next){res.render('index')})

// Posts routes
router.get('/posts',                PostCtrl.index);
router.post('/posts',               PostCtrl.create);
router.param('post',                PostCtrl.preload);
router.get('/posts/:post',          PostCtrl.show);
router.put('/posts/:post/upvote',   PostCtrl.update);

module.exports = router;
