var DOMAIN;
angular.module("OurStory", ["ui.router", "firebase"])

.run(function($rootScope, $firebaseAuth, fbUrl, $http){
  $rootScope.fbRef = new Firebase(fbUrl);
  $rootScope.afAuthObj = $firebaseAuth($rootScope.fbRef);
  $http.get("/getDomain")
  .then(function(res){
    console.log(res.data);
    DOMAIN = res.data;
  })
  .catch(function(err){
    console.log(err);
  });
})

.constant("DOMAIN", (function(){
  return DOMAIN;
})())

.constant("fbUrl", "https://keep-stuff.firebaseio.com/our-story");
