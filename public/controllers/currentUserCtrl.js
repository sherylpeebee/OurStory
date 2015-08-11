angular.module("OurStory")
.controller("currentUserCtrl", ['$scope', '$http', 'AuthFactory', '$rootScope', 'UserFactory', '$stateParams', function($scope, $http, AuthFactory, $rootScope, UserFactory, $stateParams){
console.log("in currentUserCtrl");
var photos = [];
var uri, preview = document.querySelector('img#imgPreview');
  $(document).ready(function(){
    function reset_form_element (e) {
      preview.src = "";
      e.wrap('<form>').parent('form').trigger('reset');
      e.unwrap();
    }

    $('#resetLink').on ('click', function (e) {
      console.log("resetting now");
        reset_form_element( $('#myfile') );
        e.preventDefault();
    });
    $('.modal-trigger').leanModal();

    $( "#datepicker" ).datepicker();
    $( "#datepicker" ).datepicker( "option", "dateFormat", "DD, MM d, yy");

  });

  $scope.previewFile = function() {
    console.log("preview now");
    var file  = document.querySelector('input[type=file]').files[0];
    var reader  = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
    } else if($scope.story.image){
      preview.src = $scope.story.image;
    }else{
      preview.src = "";
    }
    reader.onloadend = function () {
      uri = reader.result;
      preview.src = uri;
      // debugger;
      console.log(uri);
    };
  };

  $scope.getParams = function(){
    var currentCouple = [];
    console.log("clickety");
    console.log($stateParams);
    var currentCoupleId = $stateParams.id;
    var couples = $rootScope.currentData.relationships;
    for(var i = 0; i<couples.length; i++){
      if(currentCoupleId === couples[i]._id ){
        currentCouple.push(couples[i]);
      }
    }
    var memberOne = currentCouple[0].partnerIds.one;
    if( memberOne === $rootScope.currentData._id){
      $rootScope.memberOne = true;
    }
    console.log($rootScope.memberOne);
  };

  $scope.getUser = function(){
    console.log("hey");
    UserFactory.findUser($rootScope.authenticatedUser)
      .success(function(currentData){
        $rootScope.currentData = currentData;
      console.log("currentData: ", currentData);
    })
    .error(function(err){
      console.log(err);
    });
  };


  $scope.stories  = [];
  $scope.addStory = function(story){
    if(!story){
      story = {};
    }
    if(!story.date){
      var dateObj = new Date();
      var date = dateObj.toString();
      console.log(typeof date);
      var splitDate = date.split(" ");
      console.log(splitDate);
      story.date = splitDate.splice(0, 4).join(" ");
    }

    console.log(story);
    story.image = photos;

      UserFactory.addStory(story)
      .then(function(data){
        $scope.story = {};
        console.log(data);
      })
      .catch(function(err){
        console.log(err);
      });

      // $scope.stories.push(story);
      // $scope.story = { };
      // console.log($scope.stories);
    // console.log('SUBMITTING A PIC');
    // // $http.post('http://localhost:3000/story/pic', {img: uri})
    // UserFactory.addPictures({img: photos})
    // .success(function(data){
    //   preview.src = "";
    // })
    // .error(function(err){
    //   console.log(err);
    // });
  };

  $scope.addOnePhoto = function(){
    if(uri){
      photos.push(uri);
    }else if($scope.story.image){
      photos.push($scope.story.image);
    }
    console.log(photos);
  };

  $scope.fakeStories = [
    {summary: "Sue and Biff are best friends",
    date:"Dec 31, 1969",
    images: ["http://placehold.it/350x150", "http://placehold.it/350x150", "http://placehold.it/350x150"],
    title: "Coffee Date"},
    {summary: "Carl and Andie hate each other but stay together",
    date:"Dec 31, 1969",
    images: ["http://placehold.it/350x150", "http://placehold.it/350x150", "http://placehold.it/350x150"],
    title: "On Half Dome"},
    {summary: "Liz and Stu sometimes go for long walks but not usually",
    images: ["http://placehold.it/350x150", "http://placehold.it/350x150", "http://placehold.it/350x150"],
    title: "Jenny's Wedding"},
  ];


}]);
