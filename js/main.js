/**
 * Created by tim on 15.02.17.
 */

var avatar_img_original = "";
var avatar_img_final = "";
const nextIcon = '<img src="images/right-chevron.svg" alt="">';
const prevIcon = '<img src="images/left-chevron.svg" alt="">';
$(document).ready(function () {
  var owl = $(".owl-carousel");
  owl.owlCarousel({
    loop: false,
    items: 1,
    margin: 10,
    nav: true,
    navText: [prevIcon, nextIcon],
    dots: false,
  });
  owl.on("changed.owl.carousel", function (e) {
    $(".counter").text("Вариант " + ++e.item.index + " из " + e.item.count);
    setTimeout(select_layer, 500);
    console.log();
  });

  $(".get-photo").on("click", function () {
    $("#photoimg").click();
  });

  // загрузка фото
  $("#photoimg").on("change", function () {
    $(".get-photo").removeClass("get-photo");
    var A = $("#imageloadstatus");
    var B = $("#imageloadbutton");
    $("#photoimg").hide();

    $("#imageform")
      .ajaxForm({
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
            if (obj.message == "") {
              if ($(".main").width() > 500) {
                $("#tmpBlock").html("");
                $("#blockScreen").show();

                avatar_img_original = obj.img_original;
                avatar_img_final = obj.img_final;

                cropper.prepareImgToCrop(
                  200,
                  200,
                  "/" + avatar_img_final,
                  obj.img_width,
                  obj.img_height,
                  {
                    id: "tmpBlock", // ID блока куда будут помещены все блоки кроппинга
                    resize: "saveProportions",
                    tools: false,
                    // preview: true,
                  }
                );
                avatar_img_final = avatar_img_final
                  .split("/pre_")
                  .join("/use_pre_");
              } else {
                $("html,body").scrollTop(0);
                $("#mobileCropper_getResult").show();
                $("#mobileCropper_cancel").show();
                $(".share").hide();

                avatar_img_original = obj.img_original;
                avatar_img_final = obj.img_final;

                var mob_cropper = new MobileCropper(
                  "/" + avatar_img_final,
                  obj.img_width,
                  obj.img_height,
                  { id: "gss" }
                );

                var mobileCropper_getResult = document.getElementById(
                  "mobileCropper_getResult"
                );

                mobileCropper_getResult.addEventListener(
                  "touchstart",
                  function () {
                    var info = mob_cropper.getInfo();

                    // отресайзили
                    $("#mobileCropper_getResult").hide();
                    $("#mobileCropper_cancel").hide();
                    $(".share").show();

                    avatar_img_final = avatar_img_final
                      .split("/pre_")
                      .join("/use_pre_");

                    var sdata =
                      "img_original=" +
                      avatar_img_original +
                      "&img_final=" +
                      avatar_img_final +
                      "&offset_x=" +
                      info.x +
                      "&offset_y=" +
                      info.y +
                      "&info_w=" +
                      info.originalWidth +
                      "&info_h=" +
                      info.originalHeight;
                    // загрузить фото avatar_img_original заново с обрезкой в preview
                    $.ajax({
                      type: "POST",
                      url: "/secondfiximg.php",
                      cache: false,
                      dataType: "json",
                      data: sdata,
                      success: function (answer) {
                        if (answer.result == "success") {
                          $(".frame .file_upload .item button.upload img").attr(
                            "src",
                            answer.img_final + "?" + $.now()
                          );
                          $(".img_original").val(answer.img_original);
                          $(".img_final").val(answer.img_final);
                          $(".sc-answer").html(answer.message);
                          $(".download").attr({
                            href: answer.img_final,
                          });
                          select_layer();
                        } else if (answer.result == "error") {
                          $(".sc-answer").html(answer.message);
                        }
                      },
                    });
                    mob_cropper.cancel();
                  },
                  false
                );

                document
                  .getElementById("mobileCropper_cancel")
                  .addEventListener(
                    "touchstart",
                    function () {
                      $("#mobileCropper_getResult").hide();
                      $("#mobileCropper_cancel").hide();
                      $(".share").show();
                      mob_cropper.cancel();
                    },
                    false
                  );
              }
              //$("#photoimg").show();
            }
          } else if (answer.result == "error") {
            $(".sc-answer").html(obj.message);
          }
        },
        error: function () {
          A.hide();
          B.show();
        },
      })
      .submit();
  });

  // отресайзили
  $("#owner_photo_done_edit").click(function () {
    $("#blockScreen").hide();
    var info = cropper.info;

    var sdata =
      "img_original=" +
      avatar_img_original +
      "&img_final=" +
      avatar_img_final +
      "&offset_x=" +
      info.x +
      "&offset_y=" +
      info.y +
      "&info_w=" +
      info.w +
      "&info_h=" +
      info.h;
    // загрузить фото avatar_img_original заново с обрезкой в preview
    $.ajax({
      type: "POST",
      url: "/secondfiximg.php",
      cache: false,
      dataType: "json",
      data: sdata,
      success: function (answer) {
        if (answer.result == "success") {
          $(".frame .file_upload .item button.upload img").attr(
            "src",
            answer.img_final + "?" + $.now()
          );
          $(".img_original").val(answer.img_original);
          $(".img_final").val(answer.img_final);
          $(".sc-answer").html(answer.message);
          $(".download").attr({
            href: answer.img_final,
          });
          $("#og_image").attr("content", "/" + answer.img_final);
          select_layer();
        } else if (answer.result == "error") {
          $(".sc-answer").html(answer.message);
        }
      },
    });
  });

  function select_layer() {
    // клик на маску
    //$(".prev .box a").removeClass("active");
    //$(this).addClass("active");

    $("#imageform .img_layer").val(
      $("#carousel-avatar .active .img_layer_item").val()
    );

    if ($("#imageform .img_layer").val() != "") {
      var A = $("#imageloadstatus");
      var B = $("#imageloadbutton");
      var sdata = $("#imageform").serialize();
      $.ajax({
        type: "POST",
        url: "/fiximg.php",
        cache: false,
        dataType: "json",
        data: sdata,
        beforeSend: function () {
          A.show();
          B.hide();
        },
        success: function (answer) {
          A.hide();
          B.show();
          if (answer.result == "success") {
            $(".frame .file_upload .item button.upload img").attr(
              "src",
              answer.img_final + "?" + $.now()
            );
            $(".img_original").val(answer.img_original);
            $(".sc-answer").html(answer.message);
            $(".download").attr({
              href: answer.img_final,
            });
            $("#og_image").attr("content", "" + answer.img_final);
          } else if (answer.result == "error") {
            $(".sc-answer").html(answer.message);
          }
        },
      });
    }
  }
});
