/**
 * Created by tim on 15.02.17.
 */

var avatar_img_original = '';
var avatar_img_final = '';

$(document).ready(function () {
    
    $('.get-photo').on('click', function () {
        $('#photoimg').click();
    });

    // загрузка фото
    $('#photoimg').on('change', function () {
        $('.get-photo').removeClass('get-photo');
        $('jdiv').hide();
        // scroll page top
        $('html,body').scrollTop(0);

        var A = $("#imageloadstatus");
        var B = $("#imageloadbutton");

        $("#imageform").ajaxForm({
            beforeSubmit: function () {
                A.show();
                B.hide();
            },
            success: function (answer) {
                A.hide();
                B.show();

                var obj = $.parseJSON(answer);

                if (obj.result == "success") {
                    // загрузка основной фотографии
                    $(".sc-answer").html(obj.message);
                    if (obj.message == '') {

                        $('html,body').scrollTop(0);
                        $('#mobileCropper_getResult').show();
                        $('#mobileCropper_cancel').show();
                        $('.share').hide();

                        avatar_img_original = obj.img_original;
                        avatar_img_final = obj.img_final;

                        var cropper = new MobileCropper('/' + avatar_img_final, obj.img_width, obj.img_height, {id: 'gss'});

                        var mobileCropper_getResult = document.getElementById("mobileCropper_getResult");

                        mobileCropper_getResult.addEventListener('touchstart', function () {
                            var info = cropper.getInfo();

                            // отресайзили
                            $('#mobileCropper_getResult').hide();
                            $('#mobileCropper_cancel').hide();
                            $('.share').show();

                            avatar_img_final = avatar_img_final.split('/pre_').join('/use_pre_');

                            var sdata = 'img_original=' + avatar_img_original + '&img_final=' + avatar_img_final + '&offset_x=' + info.x + '&offset_y=' + info.y + '&info_w=' + info.originalWidth + '&info_h=' + info.originalHeight;
                            // загрузить фото avatar_img_original заново с обрезкой в preview
                            $.ajax({
                                type: 'POST',
                                url: "app/avatar/secondfiximg.php",
                                cache: false,
                                dataType: 'json',
                                data: sdata,
                                success: function (answer) {
                                    if (answer.result == "success") {
                                        $("#preview").html("<img src=\"app/avatar/" + answer.img_final + "?" + $.now() + "\" class=\"imgList\">");
                                        $(".img_original").val(answer.img_original);
                                        $(".img_final").val(answer.img_final);
                                        $(".sc-answer").html(answer.message);
                                        $(".download").attr({href: "app/avatar/download.php?file=" + answer.img_final});
                                        $(".share .vk").attr({onclick: "Share.vkontakte('http://www.gastreet.com/','GASTREET - International Restaurant Show','http://www.gastreet.com/avatar/" + answer.img_final + "','Тут собираются лючшие рестораторы мира!')"});
                                        $(".share .fb").attr({onclick: "Share.facebook('http://www.gastreet.com/','GASTREET - International Restaurant Show','http://www.gastreet.com/avatar/" + answer.img_final + "','Тут собираются лючшие рестораторы мира!')"});
                                    }
                                    else if (answer.result == "error") {
                                        $(".sc-answer").html(answer.message);
                                    }
                                }
                            });
                            cropper.cancel();
                        }, false);

                        document.getElementById("mobileCropper_cancel").addEventListener('touchstart', function () {
                            $('#mobileCropper_getResult').hide();
                            $('#mobileCropper_cancel').hide();
                            $('.share').show();
                            cropper.cancel();
                        }, false);
                    }
                }
                else if (answer.result == "error") {
                    $(".sc-answer").html(obj.message);
                }
            },
            error: function () {
                A.hide();
                B.show();
            }
        }).submit();
    });

    $('.prev .box a').click(function () {
        // клик на маску
        $('.prev .box a').removeClass("active");
        $(this).addClass("active");
        $("#imageform .img_layer").val($(this).children("img").attr("src"));
        if ($("#imageform .img_original").val() != "") {
            $("#preview").html("");
            var A = $("#imageloadstatus");
            var B = $("#imageloadbutton");
            var sdata = $("#imageform").serialize();
            $.ajax({
                type: 'POST',
                url: "app/avatar/fiximg.php",
                cache: false,
                dataType: 'json',
                data: sdata,
                beforeSend: function () {
                    A.show();
                    B.hide();
                },
                success: function (answer) {
                    A.hide();
                    B.show();
                    if (answer.result == "success") {
                        $("#preview").html("<img src=\"app/avatar/" + answer.img_final + "?" + $.now() + "\" class=\"imgList\">");
                        $(".img_original").val(answer.img_original);
                        $(".sc-answer").html(answer.message);
                        $(".download").attr({href: "app/avatar/download.php?file=" + answer.img_final});
                        $(".share .vk").attr({onclick: "Share.vkontakte('http://www.gastreet.com/','GASTREET - International Restaurant Show','http://www.gastreet.com/avatar/" + answer.img_final + "','Тут собираются лючшие рестораторы мира!')"});
                        $(".share .fb").attr({onclick: "Share.facebook('http://www.gastreet.com/','GASTREET - International Restaurant Show','http://www.gastreet.com/avatar/" + answer.img_final + "','Тут собираются лючшие рестораторы мира!')"});
                    }
                    else if (answer.result == "error") {
                        $(".sc-answer").html(answer.message);
                    }
                }
            });
        }
    });
});
