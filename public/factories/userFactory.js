angular.module("OurStory")
.factory('UserFactory', function($http){
  return {
    createOrUpdateAccount : function (userInfo){
      return $http.post('https://the-history-of-us.herokuapp.com/users/createOrUpdateAccount', userInfo);
      // return $http.post('http://localhost:8000/users/createOrUpdateAccount', userInfo);
    },
    findUser : function (userAuthObj){
      return $http.post('https://the-history-of-us.herokuapp.com/users/findUser', userAuthObj);
      // return $http.post('http://localhost:8000/users/findUser', userAuthObj);
    },
    findFriend : function (friend){
      return $http.post('https://the-history-of-us.herokuapp.com/users/findFriend', friend);
      // return $http.post('http://localhost:8000/users/findFriend', friend);
    },
    updatePartner : function (partnerInfo){
      return $http.post('https://the-history-of-us.herokuapp.com/users/updatePartner', partnerInfo);
      // return $http.post('http://localhost:8000/users/updatePartner', partnerInfo);
    },
    getRequestUpdates : function (userInfo){
      return $http.post('https://the-history-of-us.herokuapp.com/users/getRequestUpdates', userInfo);
      // return $http.post('http://localhost:8000/users/getRequestUpdates', userInfo);
    },
    createTimeline : function (appendedUserObj){
      return $http.post('https://the-history-of-us.herokuapp.com/users/createTimeline', appendedUserObj);
      // return $http.post('http://localhost:8000/users/createTimeline', appendedUserObj);
    },
    addPictures : function (img){
      return $http.post('https://the-history-of-us.herokuapp.com/stories/pic', img);
      // return $http.post('http://localhost:8000/stories/pic', img);
    },
    addStory : function (story){
      return $http.post('https://the-history-of-us.herokuapp.com/story/addStory', story);
      // return $http.post('http://localhost:8000/stories/addStory', story);
    },
    getTimeline : function (id){
      return $http.post("https://the-history-of-us.herokuapp.com/users/getTimeline", id);
      // return $http.post("users/getTimeline", id);
    },
    fetchUpdatedTimelines : function (currentData){
      return $http.post("https://the-history-of-us.herokuapp.com/users/fetchUpdatedTimelines", currentData);
      // return $http.post("users/fetchUpdatedTimelines", currentData);
    }
  };
});
