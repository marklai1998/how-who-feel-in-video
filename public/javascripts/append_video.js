$(document).ready(function () {
    let page_id = $("#id").text();
    $('.inputfile').on('click', function () {
        $('.progress-bar').width('0%');
    });
    $('.submit').on('click', function () {
        let files = $('.inputfile').get(0).files;
        if (files.length > 0) {
            // create a FormData object which will be sent as the data payload in the
            // AJAX request
            let formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                // add the files to formData object for the data payload
                formData.append('video', file, file.name);
            }
            $.ajax({
                url: '/analyzer/' + page_id + '/upload',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {

                },
                xhr: function () {
                    // create an XMLHttpRequest
                    let xhr = new XMLHttpRequest();
                    // listen to the 'progress' event
                    xhr.upload.addEventListener('progress', function (evt) {
                        if (evt.lengthComputable) {
                            // calculate the percentage of upload completed
                            let percentComplete = evt.loaded / evt.total;
                            percentComplete = parseInt(percentComplete * 100);

                            // update the Bootstrap progress bar with the new percentage
                            // $('.progress-bar').text(percentComplete + '%');
                            $('.progress-bar').width(percentComplete + '%');

                            // once the upload reaches 100%, set the progress bar text to done
                            if (percentComplete === 100) {
                                let href = $(this).attr("href");
                                $(".content").removeClass("show-menu");
                                $(".title").find("h3").removeClass("show-menu-title");
                                setTimeout(
                                    function () {
                                        window.location.replace("/analyzer/" + page_id + "/message/success");
                                    }, 1000);
                            }
                        }
                    }, false);
                    return xhr;
                },
                statusCode: {
                    500: function () {
                        window.location.replace("/analyzer/" + page_id + "/message/error");
                    }
                }
            });
        }
    });
});