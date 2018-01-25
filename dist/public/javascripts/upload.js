'use strict';

$(document).ready(function () {
    $('.inputfile').on('click', function () {
        $('.progress-bar').width('0%');
    });
    $('.submit').on('click', function () {
        var files = $('.inputfile').get(0).files;
        if (files.length > 0) {
            // create a FormData object which will be sent as the data payload in the
            // AJAX request
            var formData = new FormData();
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                // add the files to formData object for the data payload
                formData.append('video', file, file.name);
            }
            $.ajax({
                url: '/videos/upload',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function success(data) {},
                xhr: function xhr() {
                    // create an XMLHttpRequest
                    var xhr = new XMLHttpRequest();
                    // listen to the 'progress' event
                    xhr.upload.addEventListener('progress', function (evt) {
                        if (evt.lengthComputable) {
                            // calculate the percentage of upload completed
                            var percentComplete = evt.loaded / evt.total;
                            percentComplete = parseInt(percentComplete * 100);

                            // update the Bootstrap progress bar with the new percentage
                            // $('.progress-bar').text(percentComplete + '%');
                            $('.progress-bar').width(percentComplete + '%');

                            // once the upload reaches 100%, set the progress bar text to done
                            if (percentComplete === 100) {
                                var href = $(this).attr("href");
                                $(".content").removeClass("show-menu");
                                $(".title").find("h3").removeClass("show-menu-title");
                                setTimeout(function () {
                                    window.location.replace("/videos/message/success");
                                }, 1000);
                            }
                        }
                    }, false);
                    return xhr;
                },
                statusCode: {
                    500: function _() {
                        window.location.replace("/videos/message/error");
                    }
                }
            });
        }
    });
});
//# sourceMappingURL=upload.js.map