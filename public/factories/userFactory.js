angular.module("OurStory")
.factory('UserFactory', function($http){
  return {
    createOrUpdateAccount : function (userInfo){
      return $http.post('users/createOrUpdateAccount', userInfo);
    },
    findUser : function (userAuthObj){
      var provider = Object.keys(userAuthObj)[0];
      return $http.get('users/findUser?provider=' + provider + '&id=' + userAuthObj[provider]);
    },
    findFriend : function (friend){
      return $http.put('users/findFriend', friend);
    },
    reviewTimelineInvitations : function (partnerInfo){
      return $http.put('users/reviewTimelineInvitations', partnerInfo);
    },
    createTimeline : function (appendedUserObj){
      return $http.post('users/createTimeline', appendedUserObj);
    },
    addStory : function (story){
      return $http.put('stories/addStory', story);
    },
    getTimeline : function (idObj){
      return $http.get("users/getTimeline/" + idObj.id);
    },
    fetchUpdatedTimelines : function (currentData){
      var provider = Object.keys(currentData.oauth_id)[0];
      return $http.get("users/fetchUpdatedTimelines?provider=" + provider +
      "&id=" + currentData.oauth_id[provider]);
    },
    emailInvite : function (userId, friendEmail){
      return $http.post(userId + "/inviteFriends/" + friendEmail);
    }
  };
});
