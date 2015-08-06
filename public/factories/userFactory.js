angular.module("OurStory")
.factory('UserFactory', function($http){
  return {
    getCurrentData : function (authenticatedUser){
      return $http.post('http://localhost:3000/userData', authenticatedUser);
    }
  };
});
