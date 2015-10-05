!function ($, jQuery) {
    'use strict';

    /**
     * @ngdoc service
     * @public
     */
    function Camera($cordovaCamera, $window, $document, $q) {
        this.takePhoto = function () {
            return takeCordovaPhoto();
        };

        function takeCordovaPhoto() {
            var defer = $q.defer();

            var onCordovaReady = function () {
                var options = {
                    quality: 50,
                    destinationType: $window.Camera.DestinationType.DATA_URL,
                    sourceType: $window.Camera.PictureSourceType.Camera,
                    encodingType: $window.Camera.EncodingType.PNG,
                    saveToPhotoAlbum: false,
                    correctOrientation: true
                };

                $cordovaCamera.getPicture(options)
                    .then(function (imageData) {
                        $document[0].removeEventListener('deviceready', onCordovaReady);

                        defer.resolve("data:image/png;base64," + imageData);
                    });
            };

            $document[0].addEventListener('deviceready', onCordovaReady);

            return defer.promise;
        };
    }

    app.module.service('camera', Camera);
}();
