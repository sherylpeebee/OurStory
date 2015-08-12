angular.module("OurStory")
.factory('AuthFactory', function($http){
  return {
    authUser : function (){
      // return $http.jsonp('https://the-history-of-us.herokuapp.com/authorize_user');
      return $http.jsonp('http://localhost:8000/authorize_user');
    },
    authUserGet : function (){
      return $http.get('http://localhost:8000/authorize_user');
    }
  };
});
