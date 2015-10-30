angular.module("OurStory")
.factory('UserFactory', function($http){
  return {
    createOrUpdateAccount : function (userInfo){
      return $http.post('users/createOrUpdateAccount', userInfo);
    },
    findUser : function (userAuthObj){
      return $http.post('users/findUser', userAuthObj);
    },
    findFriend : function (friend){
      return $http.post('users/findFriend', friend);
    },
    reviewTimelineInvitations : function (partnerInfo){
      return $http.post('users/reviewTimelineInvitations', partnerInfo);
    },
    getRequestUpdates : function (userInfo){
      return $http.post('users/getRequestUpdates', userInfo);
    },
    createTimeline : function (appendedUserObj){
      return $http.post('users/createTimeline', appendedUserObj);
    },
    addPictures : function (img){
      return $http.post('stories/pic', img);
    },
    addStory : function (story){
      return $http.post('stories/addStory', story);
    },
    getTimeline : function (id){
      return $http.post("users/getTimeline", id);
    },
    fetchUpdatedTimelines : function (currentData){
      return $http.post("users/fetchUpdatedTimelines", currentData);
    },
    emailInvite : function (userId, friendEmail){
      return $http.post(userId + "/inviteFriends/" + friendEmail);
    }
  };
});
