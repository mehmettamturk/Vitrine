adminPanel.directive('fileUpload', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var acceptedFiles = attrs.acceptedFiles || '.img',
                inputElement = angular.element('<input type="file" name="photo" accept="' + acceptedFiles + '">'),
                eventName = attrs.eventName,
                loadEvent = attrs.loadEvent,
                progressEvent = attrs.progressEvent,
                errorEvent = attrs.errorEvent,
                uploadUrl = attrs.uploadUrl || '/product/uploadImage' ,
                uploadMethod = attrs.uploadMethod || 'POST' ,
                isHeader = !!attrs.header;

            element.append(inputElement);

            var fileToUpload = null;

            var onError = function(e) {
                errorEvent && $rootScope.$broadcast(errorEvent, JSON.parse(e.target.response));
            };

            var onProgress = function(evt){
                if (evt.lengthComputable) {
                    var data = {progress: Math.ceil((evt.loaded / evt.total) * 100)};
                    $rootScope.$broadcast(progressEvent, data);
                }
            };

            var upload = function() {
                var fd = new FormData();
                fd.append('data', fileToUpload);

                var xhr = new XMLHttpRequest();
                xhr.addEventListener('load', function(e) {
                    if (e.target.status != 200) {
                        return onError(e);
                    }
                    // scope.onImageUploaded(JSON.parse(res.target.response));
                    var data = JSON.parse(e.target.response);

                    $rootScope.$broadcast(eventName, data);
                }, false);
                xhr.addEventListener('error', onError, false);
                xhr.upload.onprogress = onProgress;
                xhr.open(uploadMethod, uploadUrl + (isHeader ? '?header=true' : ''));
                xhr.send(fd);
            };

            var handleDroppedFile = function(e) {
                e.stopPropagation();
                e.preventDefault();
                fileToUpload = e.dataTransfer.files[0];

                loadEvent && $rootScope.$broadcast(loadEvent);
                upload();
            };

            var handleSelectedFile = function() {
                fileToUpload = inputElement[0].files[0];

                loadEvent && $rootScope.$broadcast(loadEvent);
                upload();
            };

            // Bind events.
            element[0].addEventListener('drop', handleDroppedFile, false);
            inputElement[0].addEventListener('change', handleSelectedFile, false);
        }
    };
});
