angular.module("OurStory")
.controller("PrimaryCtrl", ['$scope', '$http', 'AuthFactory', '$rootScope', '$stateParams', 'UserFactory', function($scope, $http, AuthFactory, $rootScope, $stateParams, UserFactory){


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
  AuthFactory.authUser()
  .success(function(authenticatedUser){
    console.log("authenticatedUser", authenticatedUser);
    $scope.userCheck = true;
    $rootScope.authenticatedUser = authenticatedUser;
    $rootScope.id = authenticatedUser.id;
    $rootScope.authenticatedUser.partner = { };
  })
  .error(function(err){

    window.location.href = 'https://instagram.com/accounts/login/?force_classic_login=&next=/oauth/authorize%3Fclient_id%3D1d876469ae47431984b3e92b67014b84%26redirect_uri%3Dhttp%3A//localhost%3A3000/auth%26response_type%3Dcode%26scope%3Dlikes%2Bbasic%2Bcomments%2Brelationships';
    // console.log("ERROR ERROR", err);
  });
};

$scope.logout = function(){
  window.open("https://instagram.com/accounts/logout/", "_blank");
  // window.location.href = "https://instagram.com/accounts/logout/";
  $rootScope.authenticatedUser = null;
  $scope.userCheck = false;
  $("img#profile-pic").attr("src", "");
};

$scope.verifyInfo = function(currentData){
  if (currentData){
    console.log("data found: " , currentData);
    return false;
  }
  else {
    console.log("no data");
    return true;
  }
};

$scope.findUser = function(){
  UserFactory.findUser($rootScope.authenticatedUser)
    .success(function(currentData){
      $scope.verifyInfo(currentData);
    // console.log("currentData: ", currentData);
  })
  .error(function(err){
    console.log(err);
  });
};

$scope.findPartner = function(partner){
  console.log(partner);
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
  console.log('edit account');
  console.log(person);
  person.username = $rootScope.authenticatedUser.username;
  person.profile_picture = $rootScope.authenticatedUser.profile_picture;
  person.ig_id = $rootScope.authenticatedUser.id;
  person.access_token = $rootScope.authenticatedUser.access_token;
  console.log("appended person :", person);
  // $http.post("http://localhost:3000/updateUser", person)
  UserFactory.updateUser(person)
  .success(function(res){
    console.log("response: ", res);
    $scope.current = {};
  })
  .error(function(res){
    console.log("error: ", res);
  });
};




// $scope.stories = [
//   {owner: "Jack and Jill",
//   pics: ["http://placehold.it/350x150", "http://placehold.it/350x150", "http://placehold.it/350x150"],
//   title: "The Giants Game"},
//   {owner: "Jim and Jan",
//   pics: ["http://placehold.it/350x150", "http://placehold.it/350x150", "http://placehold.it/350x150"],
//   title: "Anniversary"},
//   {owner: "Sue and Biff",
//   pics: ["http://placehold.it/350x150", "http://placehold.it/350x150", "http://placehold.it/350x150"],
//   title: "Coffee Date"},
//   {owner: "Carl and Andie",
//   pics: ["http://placehold.it/350x150", "http://placehold.it/350x150", "http://placehold.it/350x150"],
//   title: "On Half Dome"},
//   {owner: "Liz and Stu",
//   pics: ["http://placehold.it/350x150", "http://placehold.it/350x150", "http://placehold.it/350x150"],
//   title: "Jenny's Wedding"},
// ];

// var base64img, preview = document.querySelector('img#imgPreview');
//   $scope.previewFile = function() {
//     console.log("preview now");
//     var file  = document.querySelector('input[type=file]').files[0];
//     var reader  = new FileReader();
//
//     if (file) {
//       reader.readAsDataURL(file);
//     } else {
//       preview.src = "";
//     }
//
//     reader.onloadend = function () {
//       base64img = reader.result;
//       preview.src = base64img;
//       // debugger;
//       console.log(base64img);
//     };
//
//   };
//
//   $scope.submitPic = function(){
//     $http.post('http://localhost:3000/pic', {img: base64img})
//     .success(function(data){
//       preview.src = "";
//       // console.log(data);
//     })
//     .error(function(err){
//       console.log(err);
//     });
//   };
//
// $(document).ready(function(){
//   function reset_form_element (e) {
//     preview.src = "";
//     e.wrap('<form>').parent('form').trigger('reset');
//     e.unwrap();
//   }
//
//   $('#resetLink').on ('click', function (e) {
//     console.log("resetting now");
//       reset_form_element( $('#myfile') );
//       e.preventDefault();
//   });
// });
  $("input.cloudinary-fileupload[type=file]").cloudinary_fileupload();
  $.cloudinary.config({"api_key":"811217315275282","cloud_name":"our-story"});


  // $('.upload_form').append($.cloudinary.unsigned_upload_tag("igz7dqsd",
  //   { cloud_name: 'our-story' }));

  $http.get("http://localhost:3000/story/secret")
  .then(function(res){
    var CLOUD_API_SECRET = res.data.CLOUD_API_SECRET;
    var obj =
    {
      "timestamp":  Date.now(),
      "callback": "http://localhost:3000/cloudinary_cors",
      "signature": CLOUD_API_SECRET,
      "api_key": "811217315275282"
    };
    // var data = JSON.stringify(obj);
    $("input[type='file']").attr('data-form-data', obj);
    // encodeURI(data)
  })
  .catch(function(err){
    console.log("error: ", err);
  });


}]);
