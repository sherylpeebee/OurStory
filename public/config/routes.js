angular.module("OurStory")
.config(function($stateProvider, $urlRouterProvider){
   $urlRouterProvider.otherwise("/");
  $stateProvider
    .state('primary', { url: "/primary", templateUrl: "./templates/primary.html", controller: "PrimaryCtrl"})
    .state('test', { url: "/test", templateUrl: "./templates/test.html", controller: "PrimaryCtrl" });
});
