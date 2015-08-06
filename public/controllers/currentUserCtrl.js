angular.module("OurStory")
.controller("currentUserCtrl", ['$scope', '$http', 'AuthFactory', '$rootScope', function($scope, $http, AuthFactory, $rootScope){
  // upload;
  // preview;
  // confirm = submit to aws
  // console.log($rootScope.authenticatedUser);

var base64img, preview = document.querySelector('img');




  $scope.previewFile = function() {
    var file  = document.querySelector('input[type=file]').files[0];
    var reader  = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
    } else {
      preview.src = "";
    }

    reader.onloadend = function () {
      base64img = reader.result;
      preview.src = base64img;
      // debugger;
      console.log(base64img);
    };

  };

  $scope.submitPic = function(){
    $http.post('http://localhost:3000/pic', {img: base64img})
    .success(function(data){
      preview.src = "";
      // console.log(data);
    })
    .error(function(err){
      console.log(err);
    });
  };

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
});


// var str = "This is my compression test.";
// console.log("Size of sample is: " + str.length);
// var compressed = LZString.compress(str);
// console.log("Size of compressed sample is: " + compressed.length);
// str = LZString.decompress(compressed);
// console.log("Sample is: " + str);



}]);
