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
      console.log("authData: ", authData);
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
  console.log(timeline);
  timeline.badgeStyle =
  (function assignTimelineStyle (){
      var badgeColors = ["primary", "success", "warning", "danger", "info"];
      var timelineInverted = Math.round(Math.random());
      var badge = Math.floor(Math.random() * (5 - 0));
      var badgeStyle = {
        timelineInverted : timelineInverted,
        badgeColor : badgeColors[badge]
      };
      return badgeStyle;
  })();
  var newestTimeline;
  var appendedUserObj = $rootScope.currentData;
  appendedUserObj.newTimeline = timeline;

  UserFactory.createTimeline(appendedUserObj)
  .then(function(res){
    if(!$rootScope.currentData.timelines[0]){
      console.log(res);
      $("#step2").css("display", "none");
      $("#newTimeline").css("display", "none");
      $("#steps_wrapper2").fadeIn(600);
      $("#inviteFriends").css("display", "inline");
      $scope.newTimelineId = res.data.newTimelineInfo.id;
      $scope.newTimelineTitle = res.data.newTimelineInfo.title;
      console.log($scope.newTimelineId);
      // console.log("new data: ", data);
      $scope.timeline = "";
    }
    else{
      $scope.newTimelineId = res.data.newTimelineInfo.id;
      $scope.newTimelineTitle = res.data.newTimelineInfo.title;
      console.log($scope.newTimelineId);
      // console.log("old and new data: ", data);
      $scope.timeline = "";
    }
  })
  .catch(function(err){
    console.log(err);
  });
};

$scope.getTimeline = function(id, idx){
  $rootScope.currentUserBadgeStyle = $rootScope.currentData.timelines[idx].badgeStyle;
  $rootScope.timelineTitle = $rootScope.currentData.timelines[idx].title;
  console.log(id);
  UserFactory.getTimeline({id : id})
  .then(function(res){
    console.log('DOING STUFF');
    console.log(res);
    // console.log(resp.data.stories);
    $rootScope.stories = res.data.stories;
    // if(!$scope.$$phase) {
    //   $scope.$apply();
    // }
    console.log($rootScope.stories);
  })
  .catch(function(err){
    console.log(err);
  });
};

$scope.fetchUpdatedTimelines = function(){
  UserFactory.fetchUpdatedTimelines($rootScope.currentData)
  .then(function(res){
    console.log(res);
    $rootScope.currentData.timelines = res.data.timelines;
  })
  .catch(function(err){
    console.log(err);
  });
};

$scope.reviewTimelineInvitations = function(req, $event, $index){
  console.log(req);
  var button = $event.target;
  var response = button.textContent;
  // var match;
  req.approved = response === "decline" ? false : true;
  if(req.approved === true){
    req.badgeStyle =
    (function assignTimelineStyle (){
        var badgeColors = ["primary", "success", "warning", "danger", "info"];
        var timelineInverted = Math.round(Math.random());
        var badge = Math.floor(Math.random() * (5 - 0));
        var badgeStyle = {
          timelineInverted : timelineInverted,
          badgeColor : badgeColors[badge]
        };
        return badgeStyle;
    })();
  }
  req.reviewed = true;
  $scope.currentData.incoming_requests.splice($index, 1, req);
  console.log($scope.currentData);
  UserFactory.reviewTimelineInvitations($scope.currentData)
  .then(function(data){
    console.log("after review: ", data);
    $rootScope.currentData.incoming_requests = data.incoming_requests;
  })
  .catch(function(err){
    console.log(err);
  });
};

}]);
