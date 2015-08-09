angular.module("OurStory")
.factory('UserFactory', function($http){
  return {
    updateUser : function (user){
      return $http.post('http://localhost:3000/users/updateUser', user);
    },
    findUser : function (user){
      return $http.post('http://localhost:3000/users/findUser', user);
    },
    findPartner : function (partner){
      return $http.post('http://localhost:3000/users/findPartner', partner);
    },
    addPicture : function (img){
      console.log("submitting: ",img);
      return $http.post('http://localhost:3000/story/pic', img);
    }
  };
});
