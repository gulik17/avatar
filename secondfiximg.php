<?php
    error_reporting(0);
    define("MAX_SIZE", "10000"); // максимальный размер 2MB

	$result = "";
	$img_original = $_POST["img_original"];
	$img_final = "";
	$message = "";

	// Загрузка фото
	$w = 1080;
	$h = 1080;

	$img   = getcwd() . '/' . $_POST["img_original"];
    $img   = str_replace('/uploads/', '/uploads/big_pre_' , $img);

    // смещение по x и y
    $offset_x = intval($_POST["offset_x"]) * 2;
    $offset_y = intval($_POST["offset_y"]) * 2;

    // размер новой картинки
	$width = intval($_POST["info_w"]) * 2;
	$height = intval($_POST["info_h"]) * 2;

	$img = @imagecreatefromjpeg($img);
	$bg = @imagecreatetruecolor($w, $h);

    if ($height < $width) {
        $ratio = $h / $height;
    } else {
        $ratio = $w / $width;
    }

    $newwidth  = $width * $ratio;
    $newheight = $height * $ratio;

    @imagecopyresized($bg, $img, 0, 0, $offset_x, $offset_y, $newwidth, $newheight, $width, $height);
   //imagecopyresized($dst_image, $src_image, $dst_x, $dst_y, $src_x, $src_y, $dst_w, $dst_h, $src_w, $src_h);

    $img_final = $_POST["img_final"];

	if ( @imagejpeg($bg, $img_final, 90) ) {
	    @copy($img_final, $img_original);
		$result = "success";
	} else {
		$result = "error";
	}

	@imagedestroy($img);
	@imagedestroy($bg); ?>
{
	"result": "<?= $result; ?>",
	"img_original": "<?= $img_original; ?>",
	"img_final": "<?= $img_final; ?>",
	"message": "<?= $message; ?>"
}