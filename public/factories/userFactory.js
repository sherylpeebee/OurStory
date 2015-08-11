angular.module("OurStory")
.factory('UserFactory', function($http){
  return {
    updateUser : function (userInfo){
      return $http.post('https://the-history-of-us.heroku.com/users/updateUser', userInfo);
    },
    updatePartner : function (partnerInfo){
      return $http.post('https://the-history-of-us.heroku.com/users/updatePartner', partnerInfo);
    },
    findUser : function (user){
      return $http.post('https://the-history-of-us.heroku.com/users/findUser', user);
    },
    findPartner : function (partner){
      return $http.post('https://the-history-of-us.heroku.com/users/findPartner', partner);
    },
    addPictures : function (img){
      return $http.post('https://the-history-of-us.heroku.com/story/pic', img);
    },
    getRequestUpdates : function (userInfo){
      return $http.post('https://the-history-of-us.heroku.com/users/getRequestUpdates', userInfo);
    },
    addStory : function (story){
      return $http.post('https://the-history-of-us.heroku.com/story/addStory', story);
    }
  };
});
