var app = angular.module("reddit_clone", ['ui.router']);

app.controller("MainCtrl", MainCtrl)
   .factory("postService",postService)
   .config(AppRouter);

MainCtrl.inject = ['$scope']
AppRouter.inject = ['$stateProvider', '$urlRouterProvider']

function AppRouter($stateProvider,$urlRouterProvider){
  $urlRouterProvider.otherwise('home');

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl'
    });
}

// service controller
function postService(){
  var postService = {
    posts: [
    {title: 'post 1', upvotes: 5},
    {title: 'post 2', upvotes: 2},
    {title: 'post 3', upvotes: 15},
    {title: 'post 4', upvotes: 9},
    {title: 'post 5', upvotes: 4},
    {title: 'new guy', upvotes: 19}
    ]
  };
  return postService;
}

// client controller
function MainCtrl($scope,postService){
  $scope.test = "I'm working!!";
  $scope.posts = postService.posts
  $scope.addPost = addPost;
  $scope.incrementUpvotes = incrementUpvotes;

  function addPost(){
    if(!$scope.title || $scope.title === '') return;
    $scope.posts.push({
      title: $scope.title,
      link: $scope.link,
      upvotes: 0
    });
    $scope.title = '';
    $scope.link = '';
  }

  function incrementUpvotes(post){
    post.upvotes += 1;
  }

}
