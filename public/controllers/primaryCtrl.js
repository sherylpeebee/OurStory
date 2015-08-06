angular.module("OurStory")
.controller("PrimaryCtrl", ['$scope', '$http', 'AuthFactory', '$rootScope', '$stateParams', function($scope, $http, AuthFactory, $rootScope, $stateParams){
  $(document).ready(function(){
    $(".button-collapse").sideNav();
  });


$scope.login = function(){
  AuthFactory.authUser()
  .success(function(authenticatedUser){
    console.log("%%%%%", authenticatedUser);

    $scope.userCheck = function(){
      return true;
    };
    $rootScope.authenticatedUser = authenticatedUser;
    $rootScope.id = authenticatedUser.id;
  })
  .error(function(err){
    console.log("ERROR ERROR", err);
  });
};



// $scope.stories = [
//   {owner: "Jack and Jill",
//   pics: ["http://placehold.it/350x150", "http://placehold.it/350x150", "http://placehold.it/350x150"],
//   title: "The Giants Game"},
//   {owner: "Jim and Jan",
//   pics: ["http://placehold.it/350x150", "http://placehold.it/350x150", "http://placehold.it/350x150"],
//   title: "Anniversary"},
//   {owner: "Sue and Biff",
//   pics: ["http://placehold.it/350x150", "http://placehold.it/350x150", "http://placehold.it/350x150"],
//   title: "Coffee Date"},
//   {owner: "Carl and Andie",
//   pics: ["http://placehold.it/350x150", "http://placehold.it/350x150", "http://placehold.it/350x150"],
//   title: "On Half Dome"},
//   {owner: "Liz and Stu",
//   pics: ["http://placehold.it/350x150", "http://placehold.it/350x150", "http://placehold.it/350x150"],
//   title: "Jenny's Wedding"},
// ];



}]);
