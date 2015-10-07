angular.module("OurStory")
.controller("inviteCtrl", ['$scope', '$http', '$rootScope', 'UserFactory', '$stateParams', function($scope, $http, $rootScope, UserFactory, $stateParams){
  console.log($stateParams);
}]);
