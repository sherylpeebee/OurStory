angular.module("OurStory")
.controller("currentUserCtrl", ['$scope', '$http', 'AuthFactory', '$rootScope', 'UserFactory', '$stateParams', function($scope, $http, AuthFactory, $rootScope, UserFactory, $stateParams){
  console.log("in currentUserCtrl");
  var paramId = $stateParams.id;
  console.log($rootScope.currentData);

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
    console.log("attempting to preview");
    var file  = document.querySelector('input[type=file]').files[0];
    var reader  = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
    } else if($scope.img.url){
      preview.src = $scope.img.url;
    }else{
      preview.src = "";
    }
    reader.onloadend = function () {
      uri = reader.result;
      preview.src = uri;
      // debugger;
      console.log(uri);
    };
    $scope.showImgTitleField = preview.src !== "" ? true : false;
  };

  var photos = [];
  function getBase64FromImageUrl(url) {
      var img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;

      img.onload = function () {// i was trying to convert urls to base64 on the frontend
        //not so easy in the back, and i need it to convert it to an image file...
          var canvas = document.createElement("canvas");
          canvas.width =this.width;
          canvas.height =this.height;

          var ctx = canvas.getContext("2d");
          ctx.drawImage(this, 0, 0);

          var dataURL = canvas.toDataURL("image/png");

          alert(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
      };
  }
  $scope.addOnePhoto = function(img){
    if(uri && !img.url){
      img.url = uri;
      photos.push(img);
      $scope.img = {};
      preview.src = "";
      $scope.showImgTitleField = false;
      // $scope.showImgTitleField = preview.src !== "" ? true : false;
    } else if (img.url) {
      var encodedImg = getBase64FromImageUrl(img.url);
      img.url = encodedImg;
      photos.push(img);
      $scope.img = {};
      preview.src = "";
      $scope.showImgTitleField = false;
      // $scope.showImgTitleField = preview.src !== "" ? true : false;
    }
    console.log(photos);
  };


  $scope.stories  = [];
  $scope.addStory = function(story){
    if(!story){
      story = {};//this is just to prevent errors; better to do a toast notification to the user
      //so they know no data was sent and they can try again
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
    var author = {};
    author.username = $rootScope.currentData.username;
    author.id = $rootScope.currentData._id;
    author.picture = $rootScope.currentData.profile_picture;
    story.author = author;
    story.timeline_id = paramId;

    // $scope.fakeStories.push(story);

    UserFactory.addStory(story)
    .then(function(data){
      $scope.story = {};
      console.log(data);
    })
    .catch(function(err){
      console.log(err);
    });
  };

  // $scope.fakeStories = [
  //   {summary: "Sue and Biff are best friends",
  //   date:"Dec 31, 1969",
  //   images: [{url: "http://lorempixel.com/output/technics-q-c-640-480-10.jpg", title: "something happened"}, {url: "http://lorempixel.com/output/technics-q-c-640-480-2.jpg", title: "our picnic"}, {url: "http://lorempixel.com/output/nature-q-c-640-480-3.jpg", title: "camping"}],
  //   title: "Coffee Date"},
  //   {summary: "Carl and Andie hate each other but stay together",
  //   date:"Dec 31, 1969",
  //   images: ["http://placehold.it/350x150", "http://placehold.it/350x150", "http://placehold.it/350x150"],
  //   title: "On Half Dome"},
  //   {summary: "Liz and Stu sometimes go for long walks but not usually",
  //   images: ["http://placehold.it/350x150", "http://placehold.it/350x150", "http://placehold.it/350x150"],
  //   title: "Jenny's Wedding"},
  // ];

    // $scope.getParams = function(){
    //   var currentCouple = [];
    //   console.log("clickety");
    //   console.log($stateParams);
    //   var currentCoupleId = $stateParams.id;
    //   var couples = $rootScope.currentData.relationships;
    //   for(var i = 0; i<couples.length; i++){
    //     if(currentCoupleId === couples[i]._id ){
    //       currentCouple.push(couples[i]);
    //     }
    //   }
    //   var memberOne = currentCouple[0].partnerIds.one;//change all memberOneto "oddMember" redo logic here
    //   if( memberOne === $rootScope.currentData._id){
    //     $rootScope.memberOne = true;
    //   }
    //   console.log($rootScope.memberOne);
    // };


      //   $scope.stories.push(story);
      //   $scope.story = { };
      //   console.log($scope.stories);
      // console.log('SUBMITTING A PIC');
      // $http.post('http://localhost:3000/story/pic', {img: uri})
      // UserFactory.addPictures({img: photos})
      // .success(function(data){
      //   preview.src = "";
      // })
      // .error(function(err){
      //   console.log(err);
      // });

}]);
