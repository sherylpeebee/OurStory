angular.module("OurStory")
.factory('AuthFactory', function($http){
  return {
    authUser : function (){
      return $http.jsonp('http://the-history-of-us.herokuapp.com/authorize_user');
    },
    authUserGet : function (){
      return $http.get('http://the-history-of-us.herokuapp.com/authorize_user');
    }
  };
});
