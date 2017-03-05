var app = angular.module("reddit_clone", []);

app.controller("MainCtrl", MainCtrl);

MainCtrl.inject = ['$scope']

function MainCtrl($scope){
  $scope.test = "I'm working!!";
  $scope.posts = [
    {title: 'post 1', upvotes: 5},
    {title: 'post 2', upvotes: 2},
    {title: 'post 3', upvotes: 15},
    {title: 'post 4', upvotes: 9},
    {title: 'post 5', upvotes: 4}
  ];
  $scope.addPost = addPost;
  $scope.incrementUpvotes = incrementUpvotes;

  function addPost(){
    if(!$scope.title || $scope.title === '') return;
    $scope.posts.push({title: $scope.title, upvotes: 0});
    $scope.title = '';
  }

  function incrementUpvotes(post){
    post.upvotes += 1;
  }

}
