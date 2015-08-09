angular.module("OurStory")
.controller("currentUserCtrl", ['$scope', '$http', 'AuthFactory', '$rootScope', function($scope, $http, AuthFactory, $rootScope){
console.log("in currentUserCtrl");
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
    } else {
      preview.src = "";
    }

    reader.onloadend = function () {
      uri = reader.result;
      preview.src = uri;
      // debugger;
      console.log(uri);
    };
  };

  function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    var result = link.click();
    return result;
  }
  $scope.stories  = [];
  $scope.addPage = function(story){
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
    $scope.stories.push(story);
    console.log($scope.stories);
    console.log('SUBMITTING A PIC');
    $http.post('http://localhost:3000/story/pic', {img: uri})
    .success(function(data){
      preview.src = "";
    })
    .error(function(err){
      console.log(err);
    });
  };

  $scope.stories = [
    {summary: "Jack and Jill went up the hill",
    date:"Dec 31, 1969",
    images: [{"http://placehold.it/350x150": "this was cool"}, {"http://placehold.it/350x150": "some stuff happened"}, {"http://placehold.it/350x150": "this too"}],
    title: "The Giants Game"},
    {summary: "Jim and Jan have a good time",
    date:"Dec 31, 1969",
    images: ["http://placehold.it/350x150", "http://placehold.it/350x150", "http://placehold.it/350x150"],
    title: "Anniversary"},
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
