angular.module("OurStory")
.controller("PrimaryCtrl", ['$scope', '$http', 'AuthFactory', '$rootScope', '$stateParams', 'UserFactory', '$state', function($scope, $http, AuthFactory, $rootScope, $stateParams, UserFactory, $state){

    var sanitycheck = $stateParams.id; //getting idVal

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
  if(! $rootScope.authenticatedUser){
    AuthFactory.authUser()
    .success(function(authenticatedUser){
      // console.log("authenticatedUser", authenticatedUser);
      $scope.userCheck = true;
      $rootScope.authenticatedUser = authenticatedUser;
      $rootScope.id = authenticatedUser.id;
      $rootScope.authenticatedUser.partner = { };
      $state.go('home');
    })
    .error(function(err){
      console.log("darn it... it broked");
      // window.location.href = 'https://instagram.com/accounts/login/?force_classic_login=&next=/oauth/authorize%3Fclient_id%3D1d876469ae47431984b3e92b67014b84%26redirect_uri%3Dhttp%3A//localhost%3A8080/auth%26response_type%3Dcode%26scope%3Dlikes%2Bbasic%2Bcomments%2Brelationships';
    });
  }
  else{
    $scope.userCheck = true;
    $state.go('home');
  }
};

$scope.logout = function(){
  window.open("https://instagram.com/accounts/logout/", "_blank");
  $rootScope.authenticatedUser = null;
  $scope.userCheck = false;
  $("img#profile-pic").attr("src", "");
};

$scope.verifyInfo = function(currentData){
  if (currentData){
    console.log("data found: " , currentData);
    currentData.relationships[0].partnerIds = {
      one: "55c817d063c2f7a511bc6f35", imgOne: "https://igcdn-photos-h-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/11849181_1022744367770535_1594369462_a.jpg",
      two: "55c819c763c2f7a511bc6f3b", imgTwo: "https://igcdn-photos-b-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-19/11375777_441663056033809_1087871125_a.jpg"
    };
    currentData.relationships[1].partnerIds = {
      one: "55c817d063c2f7a511bc6f35", imgOne: "https://igcdn-photos-h-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/11849181_1022744367770535_1594369462_a.jpg",
      two: "55c819c763c2f7a511bc6f3b", imgTwo: "https://igcdn-photos-b-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-19/11375777_441663056033809_1087871125_a.jpg"
    };
    currentData.relationships[2].partnerIds = {
      one: "55c817d063c2f7a511bc6f35", imgOne: "https://igcdn-photos-h-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/11849181_1022744367770535_1594369462_a.jpg",
      two: "55c819c763c2f7a511bc6f3b", imgTwo: "https://igcdn-photos-b-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-19/11375777_441663056033809_1087871125_a.jpg"
    };
    $rootScope.currentData = currentData;
    if(currentData.incoming_requests[0]){
      $scope.newRequests = false;
    }
    return false;
  }
  else {
    // console.log("no data");
    return true;
  }
};

$scope.findUser = function(){
  UserFactory.findUser($rootScope.authenticatedUser)
    .success(function(currentData){
      $scope.verifyInfo(currentData);
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

$scope.updateAccount = function(person){
  // console.log('edit account');
  // console.log(person);
  person.username = $rootScope.authenticatedUser.username;
  person.profile_picture = $rootScope.authenticatedUser.profile_picture;
  person.ig_id = $rootScope.authenticatedUser.id;
  person.access_token = $rootScope.authenticatedUser.access_token;
  // console.log("appended person :", person);
  // $http.post("http://localhost:8080/updateUser", person)
  UserFactory.updateUser(person)
  .success(function(res){
    // console.log("response: ", res);
    $scope.current = {};
  })
  .error(function(res){
    console.log("error: ", res);
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
