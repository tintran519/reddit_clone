var Post = require("../models/Posts");

var index = function(req, res, next){
  Post.find({}, function(err, posts){
    if(err) return next(err);

    // return posts
    res.json(posts);
  })
}

var create = function(req, res, next){
  // create new instance of post with settings from body
  var post = new Post(req.body);

  post.save(function(err, post){
    if(err) return next(err);

    res.json(post);
  })
}

var preload = function(req, res, next, id){
  // find selected Post
  var query = Post.findById(id);

  query.exec(function(err, post){
    if(err) return next(err);
    if(!post) return next(new Error('can\'t find post'));

    req.post = post;
    return next();
  })
}

var show = function(req, res){
  res.json(req.post);
}

var update = function(req, res, next){
  req.post.upvote(function(err, post){
    if(err) return next(err);

    res.json(post);
  })
}

module.exports = {
  index: index,
  create: create,
  preload: preload,
  show: show,
  update: update
}
