angular.module("OurStory")
.factory('UserFactory', function($http){
  return {
    updateUser : function (userInfo){
      return $http.post('http://localhost:3000/users/updateUser', userInfo);
    },
    updatePartner : function (partnerInfo){
      return $http.post('http://localhost:3000/users/updatePartner', partnerInfo);
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
