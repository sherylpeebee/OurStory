angular.module("OurStory")
.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise("/");
  $stateProvider
  .state('splash', { url: "/", templateUrl: "./templates/splash.html", controller: "PrimaryCtrl"})
  .state('home', { url: "/home", templateUrl: "./templates/home.html", controller: "PrimaryCtrl"})
  .state('test', { url: "/test", templateUrl: "./templates/test.html", controller: "TestCtrl" })
  // .state('new-pics', { url: "/new-pics", templateUrl: "./templates/new-pics.html", controller: "currentUserCtrl" })
  .state('currentUser', { url: "/timeline/:id", templateUrl: "./templates/currentUser.html", controller: "currentUserCtrl"});
});



  //
  //   $routeProvider
  // .when('/', {
  //   templateUrl: 'views/main.html',
  //   controller: 'MainCtrl',
  //   controllerAs: 'main'
  // })
  // .when('/about', {
  //   templateUrl: 'views/about.html',
  //   controller: 'AboutCtrl',
  //   controllerAs: 'about'
  // })
  // .otherwise({
  //   redirectTo: '/'
  // });
