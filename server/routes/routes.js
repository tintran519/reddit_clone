var express = require('express');
var router = new express.Router();

// Require controllers
var PostCtrl = require('../controllers/post');
var CommentCtrl = require('../controllers/comments');
// router.get('/',function(req,res,next){res.render('index')})

// Posts routes
router.get('/posts',                PostCtrl.index);
router.post('/posts',               PostCtrl.create);
router.param('post',                PostCtrl.preload);
router.get('/posts/:post',          PostCtrl.show);
router.put('/posts/:post/upvote',   PostCtrl.update);

// Comments routes
router.get('/posts/:post/comments/', CommentCtrl.index);
router.get('/posts/:post/comments/:comments', CommentCtrl.show);
router.param('comments',                              CommentCtrl.preload);
router.post('/posts/:post/comments',                  CommentCtrl.create);
router.put('/posts/:post/comments/:comments/upvote',  CommentCtrl.update);

module.exports = router;
