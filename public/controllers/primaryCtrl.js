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
  $state.go('home');
  location.reload();
};

$scope.verifyInfo = function(currentData){
  console.log(currentData);
  console.log(Object.keys(currentData)[0]);
  // debugger;
  if (Object.keys(currentData)[0] !== undefined){
    $rootScope.currentData = currentData;
    $scope.hideInviteForm = $rootScope.currentData.timelines[0];
    $scope.hideStep3 = $rootScope.currentData.timelines[0];
    console.log($rootScope.currentData);
    console.log($rootScope.currentData.timelines);
    if($rootScope.currentData && !$rootScope.currentData.timelines[0]){
      $("#newTimeline").css("display", "inline");
    }
    if($rootScope.currentData && $rootScope.currentData.timelines[0]){
      $("#step3").css("visibility", "hidden");
    }
    if(currentData.incoming_requests[0]){
      $scope.newRequests = false;
    }
    return false;
  }
  else {
    $scope.hideHint = true;
    $scope.hideInviteForm = true;
    return true;
  }
};


$scope.findUser = function(){
  console.log($rootScope.authenticatedUser.oauth_id);
  UserFactory.findUser($rootScope.authenticatedUser.oauth_id)
    .success(function(currentData){
      console.log(currentData);
      $scope.verifyInfo(currentData);
  })
    .error(function(err){
      console.log(err);
  });
};

$scope.findFriend = function(friend){
  friend.from = $rootScope.authenticatedUser.username;
  friend.timeline = {};
   friend.timeline.id = $scope.newTimelineId;
   friend.timeline.title = $scope.newTimelineTitle;
  console.log(friend);
  UserFactory.findFriend(friend)
    .success(function(response){
      // $scope.verifyInfo(currentData);
      if(typeof response !== "object"){
        swal({
        title: response,
        text: "Provide an email:",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-top",
        inputPlaceholder: "jane@doe.com"
        }, function(inputValue){
          if (inputValue === false)
          return false;
          if (inputValue === "") {
            swal.showInputError("Did you mean to cancel?");
            return false;
          }
          var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          if (!filter.test(inputValue)){
            swal.showInputError("Please enter a valid email address.");
          }else{
            swal("Fantastic!", "We'll email an invite out to: " + inputValue, "success");
            $scope.friend = "";
          }
        });
      }
      else{
        swal("Success! We'll send them a request for you.");
        $scope.friend = "";
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
  if($rootScope.currentData){
    sweetAlert({
      title: "Are you sure you want to change your identity?!",
      text: "This might make it harder for your friends to find you...",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes. I write my own destiny.",
      closeOnConfirm: false
      },
      function(){
      sweetAlert({
        title: "We just do as we're told.",
        text: "Spread the word. You're about to become a new person.",
        imageUrl: "/images/A-Okay.png"
      }, function(){
        UserFactory.createOrUpdateAccount(person)
        .success(function(res){
          $rootScope.currentData = res;
          // $("#step1").css("display", "none");
          // $("#createOrUpdateAccount").css("display", "none");
          // $("#steps_wrapper1").fadeIn(600);
          // if(!$rootScope.currentData.timeline[0]){
          //   $("#newTimeline").css("display", "inline");
          // }
          console.log("response: ", res);
          $scope.current = {};
        })
        .error(function(res){
          console.log("error: ", res);
        });
      });
    });
  }
  else if(!$rootScope.currentData){
    UserFactory.createOrUpdateAccount(person)
    .success(function(res){
      $rootScope.currentData = res;
      $("#step1").css("display", "none");
      $("#createOrUpdateAccount").css("display", "none");
      $("#steps_wrapper1").fadeIn(600);
      $("#newTimeline").css("display", "inline");
      console.log("response: ", res);
      $scope.current = {};
    })
    .error(function(res){
      console.log("error: ", res);
    });
  }
};

$scope.createTimeline = function(timeline){
  var newestTimeline;
  console.log(timeline);
  var appendedUserObj = $rootScope.currentData;
  appendedUserObj.newTimeline = timeline;

  UserFactory.createTimeline(appendedUserObj)
  .then(function(data){
    if(!$rootScope.currentData.timelines[0]){
      console.log(data);
      $("#step2").css("display", "none");
      $("#newTimeline").css("display", "none");
      $("#steps_wrapper2").fadeIn(600);
      $("#inviteFriends").css("display", "inline");
      newestTimelineIndex = data.data.timelines.length - 1;
      newestTimeline = data.data.timelines[newestTimelineIndex];
      $scope.newTimelineId = newestTimeline.id;
      $scope.newTimelineTitle = newestTimeline.title;
      console.log($scope.newTimelineId);
      // console.log("new data: ", data);
      $scope.timeline = "";
    }
    else{
      newestTimelineIndex = data.data.timelines.length - 1;
      newestTimeline = data.data.timelines[newestTimelineIndex];
      $scope.newTimelineId = newestTimeline.id;
      $scope.newTimelineTitle = newestTimeline.title;
      console.log($scope.newTimelineId);
      // console.log("old and new data: ", data);
      $scope.timeline = "";
    }
  })
  .catch(function(err){
    console.log(err);
  });
};

$scope.getTimeline = function(id){
  console.log(id);
  UserFactory.getTimeline({id : id})
  .then(function(data){
    console.log('DOING STUFF');
    console.log(data);
  })
  .catch(function(err){
    console.log(err);
  });
};

$scope.fetchUpdatedTimelines = function(){
  UserFactory.fetchUpdatedTimelines($rootScope.currentData)
  .then(function(data){
    console.log(data);
    $rootScope.currentData.timelines = data.data.timelines;
  })
  .catch(function(err){
    console.log(err);
  });
};

$scope.updatePartner = function(res, req){
  console.log("RESPONSE: ",res);
  console.log("click");
  // var match;
  // var response = res;
  // // console.log("allData: ", $scope.currentData);
  // var index = $scope.currentData.incoming_requests.indexOf(req);
  // var wholeObj = $scope.currentData.incoming_requests[index];
  // var toEdit = $scope.currentData.incoming_requests[index]._id;
  // $scope.currentData.incoming_requests.forEach(function(request){
  //   if(request._id === toEdit){
  //     match = request;
  //   }
  // });
  // match.approved = response.reject ? false : true;
  // match.reviewed = true;
  // $scope.currentData.incoming_requests.splice([index], 1, wholeObj);
  // // $scope.currentData.incoming_requests.splice(index, 1);
  // console.log($scope.currentData);
  // UserFactory.updatePartner($scope.currentData)
  // .then(function(data){
  //   console.log(data);
  //   UserFactory.getRequestUpdates($scope.currentData)
  //   .then(function(updates){
  //     console.log("updates: ", updates.config.data.incoming_requests);
  //     var currentRequests = updates.config.data.incoming_requests;
  //           console.log("currentRequests: ", currentRequests);
  //           console.log("currentRequestslength: ", currentRequests.length);
  //       for(var i = 0; i< currentRequests.length; i++){
  //         console.log("currentRequests: ", currentRequests[i].reviewed);
  //         if(currentRequests[i].reviewed === true){
  //           currentRequests.splice(i, 1);
  //           console.log($scope.currentData);
  //         }
  //     }
  //   })
  //   .catch(function(err){
  //     console.log(err);
  //   });
  // })
  // .catch(function(err){
  //   console.log(err);
  // });
};

}]);
