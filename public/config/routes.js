angular.module("OurStory")
.config(function($stateProvider, $urlRouterProvider){
   $urlRouterProvider.otherwise("/");
  $stateProvider
    .state('home', { url: "/", controller: "currentUserCtrl"})
    .state('test', { url: "/test", templateUrl: "./templates/test.html", controller: "TestCtrl" })
    // .state('new-pics', { url: "/new-pics", templateUrl: "./templates/new-pics.html", controller: "currentUserCtrl" })
    .state('currentUser', { url: "/:id", templateUrl: "./templates/currentUser.html", controller: "currentUserCtrl"});
});
