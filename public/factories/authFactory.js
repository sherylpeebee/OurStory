angular.module("OurStory")
.factory('AuthFactory', function($http){
  return {
    authUser : function (){
      return $http.jsonp('https://the-history-of-us.com/authorize_user');
    },
    authUserGet : function (){
      return $http.get('https://the-history-of-us.com/authorize_user');
    }
  };
});
