angular.module("OurStory")
.factory('AuthFactory', function($http){
  return {
    authUser : function (){
      return $http.jsonp('http://localhost:8080/authorize_user');
    },
    authUserGet : function (){
      return $http.get('http://localhost:8080/authorize_user');
    }
  };
});
