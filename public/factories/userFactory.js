angular.module("OurStory")
.factory('UserFactory', function($http){
  return {
    updateUser : function (userInfo){
      // return $http.post('https://the-history-of-us.herokuapp.com/users/updateUser', userInfo);
      return $http.post('http://localhost:8000/users/updateUser', userInfo);
    },
    updatePartner : function (partnerInfo){
      // return $http.post('https://the-history-of-us.herokuapp.com/users/updatePartner', partnerInfo);
      return $http.post('http://localhost:8000/users/updatePartner', partnerInfo);
    },
    findUser : function (user){
      // return $http.post('https://the-history-of-us.herokuapp.com/users/findUser', user);
      return $http.post('http://localhost:8000/users/findUser', user);
    },
    findPartner : function (partner){
      // return $http.post('https://the-history-of-us.herokuapp.com/users/findPartner', partner);
      return $http.post('http://localhost:8000/users/findPartner', partner);
    },
    addPictures : function (img){
      // return $http.post('https://the-history-of-us.herokuapp.com/story/pic', img);
      return $http.post('http://localhost:8000/story/pic', img);
    },
    getRequestUpdates : function (userInfo){
      // return $http.post('https://the-history-of-us.herokuapp.com/users/getRequestUpdates', userInfo);
      return $http.post('http://localhost:8000/users/getRequestUpdates', userInfo);
    },
    addStory : function (story){
      // return $http.post('https://the-history-of-us.herokuapp.com/story/addStory', story);
      return $http.post('http://localhost:8000/story/addStory', story);
    }
  };
});
