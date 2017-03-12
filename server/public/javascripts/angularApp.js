var app = angular.module("reddit_clone", ['ui.router']);

app.controller("MainCtrl", MainCtrl)
   .factory("postService", postService)
   .config(AppRouter);

app.controller("PostsCtrl", PostsCtrl)

// Injections
MainCtrl.inject = ['$scope', 'postService']
AppRouter.inject = ['$stateProvider', '$urlRouterProvider']
PostsCtrl.inject = ['$scope', 'postService', 'postPromise']
postService.inject = ['$http']

// States/Routes
function AppRouter($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('home');

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      // ensure all posts are queried before state loads
      resolve: {
        postPromise: ['postService', function(postService){
          return postService.getAll()
        }]
      }
    })
    .state('posts', {
      url: '/posts/{id}',
      templateUrl: '/posts.html',
      controller: 'PostsCtrl',
      resolve: {
        postPromise: ['$stateParams', 'postService', function($stateParams, postService){
          return postService.get($stateParams.id);
        }]
      }
    })
}

// Service controller
function postService($http){
  var postService = {
    posts: [
      {title: 'post 1', comments:[], upvotes: 5},
      {title: 'post 2', comments:[], upvotes: 2},
      {title: 'post 3', comments:[], upvotes: 15},
      {title: 'post 4', comments:[], upvotes: 9},
      {title: 'post 5', comments:[], upvotes: 4},
      {title: 'new guy', comments:[], upvotes: 19}
    ],
    getAll: function(){
      return $http.get('/posts').success(function(data){
        // retrieves all posts from backend and replaces posts array with this new list
        angular.copy(data, postService.posts)
      })
    },
    get: function(id){
      return $http.get(`/posts/${id}`)
        .then(function(res){
          return res.data;
        })
    },
    create: function(post){
      return $http.post('/posts', post).success(function(data){
        // push to current array to allow immediate display
        postService.posts.push(data);
      });
    },
    upvote: function(post){
      return $http.put(`/posts/${post._id}/upvote`)
        .success(function(data){
          // update client to display changes
          post.upvotes += 1;
        });
    },
    addComment: function(id, comment){
      return $http.post(`/posts/${id}/comments`, comment);
    },
    upvoteComment: function(post, comment){
      return $http.put(`/posts/${post._id}/comments/${comment._id}/upvote`)
        .success(function(data){
          comment.upvotes += 1;
        });
    }
  };

  return postService;
}

// Main controller
function MainCtrl($scope,postService){
  $scope.test = "I'm working!!";
  $scope.posts = postService.posts
  $scope.addPost = addPost;
  $scope.incrementUpvotes = incrementUpvotes;
  $scope.selectPost = selectPost;


  function addPost(){
    if(!$scope.title || $scope.title === '') return;
    postService.create({
      title: $scope.title,
      link: $scope.link,
    });
    $scope.title = '';
    $scope.link = '';
  }

  function incrementUpvotes(post){
    // call function to update backend upvote
    postService.upvote(post);
  }

  function selectPost(post){
    return $scope.posts.indexOf(post);
  }
}

// Posts Controller
function PostsCtrl($scope, postService, postPromise){
  $scope.post = postPromise;
  $scope.incrementUpvotesComment = incrementUpvotesComment;
  $scope.addComment = addComment;

  function incrementUpvotesComment(comment){
    postService.upvoteComment(postPromise, comment)
  }

  function addComment(){
    if($scope.body === '') return;
    postService.addComment(postPromise._id,{
      body: $scope.body,
      author: 'user',
    }).success(function(comment){
      $scope.post.comments.push(comment);
    });
    $scope.body = '';
  };
}
