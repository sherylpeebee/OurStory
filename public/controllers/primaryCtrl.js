angular.module("OurStory")
.controller("PrimaryCtrl", ['$scope', '$http', function($scope, $http){
  console.log("hi");
  $scope.test = 'some other stuffs';

  // $http.get('http://localhost:3000/poo')
  //   .then(function(data, err){
  //     if(err){
  //       console.log(err);
  //     }
  //     console.log(data);
  // });
  $http.jsonp('http://localhost:3000/authorize_user')
    .success(function(data){

      console.log("%%%%%", data);
  })
  .error(function(err){
    console.log("ERROR ERROR", err);
  });
}]);
