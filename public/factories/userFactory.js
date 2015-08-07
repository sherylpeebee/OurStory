angular.module("OurStory")
.factory('UserFactory', function($http){
  return {
    updateUser : function (user){
      return $http.post('http://localhost:3000/updateUser', user);
    },
    findUser : function (user){
      return $http.post('http://localhost:3000/findUser', user);
    },
    findPartner : function (partner){
      return $http.post('http://localhost:3000/findPartner', partner);
    }
  };
});
