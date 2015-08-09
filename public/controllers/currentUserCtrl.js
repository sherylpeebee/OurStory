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

    // console.log(downloadURI(uri, "name"));

    //below may be of use if i get response from cloudinary

    $http.post('http://localhost:3000/story/pic', {img: uri})
    .success(function(data){
      preview.src = "";
      // console.log(data);
    })
    .error(function(err){
      console.log(err);
    });
  };





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
  })
  .catch(function(err){
    console.log("error: ", err);
  });


// $("input.cloudinary-fileupload[type=file]").cloudinary_fileupload();
// $.cloudinary.config({"api_key":"811217315275282","cloud_name":"our-story"});
//
// $('.upload_form').append($.cloudinary.unsigned_upload_tag("igz7dqsd",
//   { cloud_name: 'our-story' }));
//
// $http.get("http://localhost:3000/story/secret")
// .then(function(res){
//   var CLOUD_API_SECRET = res.data.CLOUD_API_SECRET;
//   var obj =
//   {
//     "timestamp":  Date.now(),
//     "callback": "http://localhost:3000/cloudinary_cors",
//     "signature": CLOUD_API_SECRET,
//     "api_key": "811217315275282"
//   };
//   var data = JSON.stringify(obj);
//   $("input[type='file']").attr('data-form-data', encodeURI(data));
// })
// .catch(function(err){
//   console.log("error: ", err);
// });

}]);
