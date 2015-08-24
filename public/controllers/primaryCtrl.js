angular.module("OurStory")
.controller("PrimaryCtrl", ['$scope', '$http', 'AuthFactory', '$rootScope', '$stateParams', 'UserFactory', '$state', function($scope, $http, AuthFactory, $rootScope, $stateParams, UserFactory, $state){
  var id;
  $scope.state = $state.current;
  $scope.params = $stateParams;

  $(document).ready(function(){
    $(".button-collapse").sideNav();
    $(".collapse").sideNav({
      menuWidth: 300, // Default is 240
      edge: 'left', // Choose the horizontal origin
      closeOnClick: false
    });
    // $('.collapse').sideNav('hide');
    $('.tooltipped').tooltip({delay: 50});
    console.log("ready!");
  });

$scope.login = function(){
  if(!$rootScope.authenticatedUser){
    AuthFactory.authUser()
    .then(function(authData){
      console.log("authData", authData);
      $rootScope.userCheck = true;
      $rootScope.authData = authData;
      $rootScope.authenticatedUser = authData.twitter;
      var provider = $rootScope.authData.provider;
      id = authData[provider].id;
      $rootScope.authenticatedUser.oauth_id = {};
      $rootScope.authenticatedUser.oauth_id[provider] = id;
      $rootScope.authenticatedUser.partner = { };
      $state.go('home');
    });
  }
  else{
    $scope.userCheck = true;
    $state.go('home');
  }
};

$scope.logout = function(){
  $rootScope.afAuthObj.$unauth();
  $rootScope.authenticatedUser = null;
  $rootScope.userCheck = false;
  // $("img#profile-pic").attr("src", "");
  $state.go('home');
};

$scope.verifyInfo = function(currentData){
  if (currentData){
    // console.log("data found: " , currentData.data);
    $rootScope.currentData = currentData.data;
    console.log($rootScope.currentData);
    if($rootScope.currentData === undefined){
      console.log("YAY it makes sense!!");
    }
    if(currentData.incoming_requests[0]){
      $scope.newRequests = false;
    }
    return false;
  }
  else {
    return true;
  }
};

$scope.findUser = function(){
  console.log($rootScope.authenticatedUser.oauth_id);
  UserFactory.findUser($rootScope.authenticatedUser.oauth_id)
    .success(function(currentData){
      $scope.verifyInfo(currentData);
      console.log(currentData);
  })
    .error(function(err){
      console.log(err);
  });
};

$scope.findPartner = function(partner){
  // console.log(partner);
  partner.from = $rootScope.authenticatedUser.username;
  UserFactory.findPartner(partner)
    .success(function(response){
      // $scope.verifyInfo(currentData);
      if(typeof response !== "object"){
        alert(response);
      }
      else{
        alert("Success! We'll send them a request for you.");
      }
  })
  .error(function(err){
    console.log(err);
  });
};

$scope.createOrUpdateAccount = function(person){
  person.username = $rootScope.authenticatedUser.username;
  person.profile_picture = $rootScope.authenticatedUser.profileImageURL;
  person.oauth_id = $rootScope.authenticatedUser.oauth_id;
  person.access_token = $rootScope.authenticatedUser.accessToken;
  console.log(person);
  UserFactory.createOrUpdateAccount(person)
  .success(function(res){
    $rootScope.currentData = res;
    $("#step1").css("display", "none");
    $("#createOrUpdateAccount").css("display", "none");
    $("#steps_wrapper1").fadeIn(600);
    $("#newTimeline").css("display", "inline");
    // console.log("response: ", res);
    // $rootScope.currentData =
    $scope.current = {};

  })
  .error(function(res){
    console.log("error: ", res);
  });
};

$scope.createTimeline = function(timeline){
  UserFactory.createTimeline(timeline)
  .then(function(data){
    console.log(data);
    // $rootScope.currentData = res;
    $("#step2").css("display", "none");
    $("#newTimeline").css("display", "none");
    $("#steps_wrapper2").fadeIn(600);
    // console.log("response: ", res);
    // $rootScope.currentData =
    $scope.timeline = "";
  })
  .catch(function(err){
    console.log(err);
  });
};

$scope.updatePartner = function(res, req){
  console.log("RESPONSE: ",res);
  var match;
  var response = res;
  // console.log("allData: ", $scope.currentData);
  var index = $scope.currentData.incoming_requests.indexOf(req);
  var wholeObj = $scope.currentData.incoming_requests[index];
  var toEdit = $scope.currentData.incoming_requests[index]._id;
  $scope.currentData.incoming_requests.forEach(function(request){
    if(request._id === toEdit){
      match = request;
    }
  });
  match.approved = response.reject ? false : true;
  match.reviewed = true;
  $scope.currentData.incoming_requests.splice([index], 1, wholeObj);
  // $scope.currentData.incoming_requests.splice(index, 1);
  console.log($scope.currentData);
  UserFactory.updatePartner($scope.currentData)
  .then(function(data){
    console.log(data);
    UserFactory.getRequestUpdates($scope.currentData)
    .then(function(updates){
      console.log("updates: ", updates.config.data.incoming_requests);
      var currentRequests = updates.config.data.incoming_requests;
            console.log("currentRequests: ", currentRequests);
            console.log("currentRequestslength: ", currentRequests.length);
        for(var i = 0; i< currentRequests.length; i++){
          console.log("currentRequests: ", currentRequests[i].reviewed);
          if(currentRequests[i].reviewed === true){
            currentRequests.splice(i, 1);
            console.log($scope.currentData);
          }
      }
    })
    .catch(function(err){
      console.log(err);
    });
  })
  .catch(function(err){
    console.log(err);
  });
};
}]);
