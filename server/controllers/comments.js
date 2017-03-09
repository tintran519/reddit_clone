var Comment = require('../models/Comments')

var create = function(req, res, next){
  var comment = new Comment(req.body);
  // Add the post id to the comment schema
  comment.post = req.post;
  comment.save(function(err, comment){
    if(err) return next(err);
    // save and add comment to post.comments array
    req.post.comments.push(comment);
    // save updated post
    req.post.save(function(err, post){
      if(err) return next(err);

      res.json(comment);
    })
  })
}

var preload = function(req, res, next, id){console.log('here is the id',id)
  var query = Comment.findById(id);

  query.exec(function(err, comment){
    if(err) return next(err);
    if(!comment) return next(new Error('can\'t find comment'));

    req.comment = comment;
    return next();
  })
}

var update = function(req, res, next){
  req.comment.upvote(function(err, comment){
    if(err) return next(err);

    res.json(comment);
  })
}

var index = function(req,res,next){
  Comment.find({},function(err,comments){
    if(err) return next(err);

    res.json(comments);
  })
}

var show = function(req,res,next){
  console.log('show is working',req.comment)
  res.json(req.comment);
}

module.exports = {
  preload: preload,
  index: index,
  show: show,
  update: update,
  create: create
}
