angular.module("OurStory")
.factory('AuthFactory', function($http, $firebaseAuth, $rootScope){
  //  var ref = new Firebase("https://keep-stuff.firebaseio.com/our-story");
  //  var authObj = $firebaseAuth(ref);
  return {
    authUser : function (){
      // return $http.jsonp('https://the-history-of-us.herokuapp.com/authorize_user');
      // return $http.jsonp('http://localhost:8000/auth/instagram');
      return $rootScope.afAuthObj.$authWithOAuthPopup("twitter");
    },
    authUserGet : function (){
      return $http.get('http://localhost:8000/auth/instagram');
    }
  };
});
