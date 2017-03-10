var app = angular.module("reddit_clone", ['ui.router']);

app.controller("MainCtrl", MainCtrl)
   .factory("postService", postService)
   .config(AppRouter);

app.controller("PostsCtrl", PostsCtrl)

// Injections
MainCtrl.inject = ['$scope', 'postService']
AppRouter.inject = ['$stateProvider', '$urlRouterProvider']
PostsCtrl.inject = ['$scope', '$stateParams', 'postService']
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
        postPromise: ['postService', function(posts){
          return posts.getAll()
        }]
      }
    })
    .state('posts', {
      url: '/posts/{id}',
      templateUrl: '/posts.html',
      controller: 'PostsCtrl'
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
function PostsCtrl($scope, $stateParams, postService){
  $scope.post = postService.posts[$stateParams.id];
  $scope.incrementUpvotes = incrementUpvotes;
  $scope.addComment = addComment;

  function incrementUpvotes(comment){
    comment.upvotes += 1;
  }

  function addComment(){
    if($scope.body === '') return;
    $scope.post.comments.push({
      body: $scope.body,
      author: 'user',
      upvotes: 0
    });
    $scope.body = '';
  }
}
