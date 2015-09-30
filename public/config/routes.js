angular.module("OurStory")
.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise("/");
  $stateProvider
  .state('splash', { url: "/", templateUrl: "./templates/splash.html", controller: "PrimaryCtrl"})
  .state('about', { url: "/about", templateUrl: "./templates/about.html", controller: "PrimaryCtrl"})
  .state('home', { url: "/home", templateUrl: "./templates/home.html", controller: "PrimaryCtrl"})
  .state('test', { url: "/test", templateUrl: "./templates/test.html", controller: "TestCtrl" })
  .state('currentUser', { url: "/timeline/:id", templateUrl: "./templates/currentUser.html", controller: "currentUserCtrl"});
});
