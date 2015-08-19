angular.module('OurStory')
.run(function($rootScope, $firebaseAuth, fbUrl){
  $rootScope.fbRef = new Firebase(fbUrl);
  $rootScope.afAuthObj = $firebaseAuth($rootScope.fbRef);
});
