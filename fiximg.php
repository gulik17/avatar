<?php
    error_reporting(0);
    define("MAX_SIZE", "10000"); // максимальный размер 2MB

    $result = "";
    $img_original = $_POST["img_original"];

    $img_final = "";
    $message = "";

    // Загрузка штампа и фото, для которого применяется водяной знак (называется штамп или печать)
    $w = 1080;
    $h = 1080;
    $percent = 0;

    $img   = getcwd() . '/' . $img_original;
    $exif = exif_read_data($img);
    
    $stamp = $_SERVER['DOCUMENT_ROOT'].'/'.$_POST["img_layer"];

    // получение нового размера
    list($width, $height) = @getimagesize($img);

    $stamp = @imagecreatefrompng($stamp);
    $img = @imagecreatefromjpeg($img);

    if(!empty($exif['Orientation'])) {
        switch($exif['Orientation']) {
            case 8:
                $img = imagerotate($img,90,0);
                break;
            case 3:
                $img = imagerotate($img,180,0);
                break;
            case 6:
                $img = imagerotate($img,-90,0);
                break;
        }
    }

    $bg = @imagecreatetruecolor($w, $h);

    if ($height < $width) {
        $percent = $height  * 100 / $h;
    } else {
        $percent = $width  * 100 / $w;
    }
    $newwidth  = round( ($width  * 100) / $percent );
    $newheight = round( ($height * 100) / $percent );
    @imagecopyresized($bg, $img, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);

	@imagecopy($bg, $stamp, 0, 0, 0, 0, $w, $h);

	if ( @imagejpeg($bg, $_POST["img_final"], 90) ) {
		$result = "success";
		$img_final = $_POST["img_final"];
	} else {
		$result = "error";
	}

	@imagedestroy($img);
	@imagedestroy($bg);
	@imagedestroy($stamp);
?>
{
    "result": "<?= $result; ?>",
    "img_original": "<?= $img_original; ?>",
    "img_final": "<?= $img_final; ?>",
    "message": "<?= $message; ?>"
}