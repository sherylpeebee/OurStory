angular.module("OurStory")
.controller("PrimaryCtrl", ['$scope', '$http', 'AuthFactory', '$rootScope', '$stateParams', 'UserFactory', function($scope, $http, AuthFactory, $rootScope, $stateParams, UserFactory){


  $(document).ready(function(){
    $(".button-collapse").sideNav();
    $(".collapse").sideNav({
      menuWidth: 300, // Default is 240
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true
    });
    // $('.collapse').sideNav('hide');
    $('.tooltipped').tooltip({delay: 50});
    console.log("ready!");
  });


$scope.login = function(){
  AuthFactory.authUser()
  .success(function(authenticatedUser){
    console.log("authenticatedUser", authenticatedUser);
    $scope.userCheck = true;
    $rootScope.authenticatedUser = authenticatedUser;
    $rootScope.id = authenticatedUser.id;
    $rootScope.authenticatedUser.partner = { };
  })
  .error(function(err){

    window.location.href = 'https://instagram.com/accounts/login/?force_classic_login=&next=/oauth/authorize%3Fclient_id%3D1d876469ae47431984b3e92b67014b84%26redirect_uri%3Dhttp%3A//localhost%3A3000/auth%26response_type%3Dcode%26scope%3Dlikes%2Bbasic%2Bcomments%2Brelationships';
    // console.log("ERROR ERROR", err);
  });
};

$scope.logout = function(){
  $rootScope.authenticatedUser = null;
  $scope.userCheck = false;
  $("img#profile-pic").attr("src", "");
};

$scope.verifyInfo = function(currentData){
  if (!currentData){
    return true;
  }
  else {
    return false;
  }
};

$scope.findUser = function(){
  UserFactory.getCurrentData($rootScope.authenticatedUser)
    .success(function(currentData){
      $scope.verifyInfo(currentData);
    console.log("@#$@#@#$@#$", currentData);
  })
  .error(function(err){
    console.log(err);
  });
};

$scope.updateAccount = function(person){
  console.log('edit account');
  person.username = $rootScope.authenticatedUser.username;
  person.profile_picture = $rootScope.authenticatedUser.profile_picture;
  person.ig_id = $rootScope.authenticatedUser.id;
  person.access_token = $rootScope.authenticatedUser.access_token;
  console.log("appended person :", person);
  $http.post("http://localhost:3000/userData", person)
  .then(function(res){
    console.log("response: ", res);
    $scope.current = {};
  })
  .catch(function(res){
    console.log("error: ", res);
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
