angular.module("OurStory")
.factory('UserFactory', function($http){
  return {
    updateUser : function (userInfo){
      return $http.post('http://localhost:8080/users/updateUser', userInfo);
    },
    updatePartner : function (partnerInfo){
      return $http.post('http://localhost:8080/users/updatePartner', partnerInfo);
    },
    findUser : function (user){
      return $http.post('http://localhost:8080/users/findUser', user);
    },
    findPartner : function (partner){
      return $http.post('http://localhost:8080/users/findPartner', partner);
    },
    addPictures : function (img){
      return $http.post('http://localhost:8080/story/pic', img);
    },
    getRequestUpdates : function (userInfo){
      return $http.post('http://localhost:8080/users/getRequestUpdates', userInfo);
    },
    addStory : function (story){
      return $http.post('http://localhost:8080/story/addStory', story);
    }
  };
});
