angular.module("OurStory")
.controller("currentUserCtrl", ['$scope', '$http', 'AuthFactory', '$rootScope', function($scope, $http, AuthFactory, $rootScope){

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

  $scope.submitPic = function(){
    $http.post('http://localhost:3000/story/pic', {img: uri})
    .success(function(data){
      preview.src = "";
    })
    .error(function(err){
      console.log(err);
    });
  };

}]);
