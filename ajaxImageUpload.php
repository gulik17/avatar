<?php
    // загрузка оригинала, обрезка фото для визуализации кропа
    error_reporting(0);
    define("MAX_SIZE", "10000"); // максимальный размер 2MB

    function getExtension($str) {
        $i = @strrpos($str, ".");
        if (!$i) { return ""; }
        $l = @strlen($str) - $i;
        $ext = @substr($str, $i+1, $l);
        return $ext;
    }

    // первая загрузка фото
    function fixFirstImg($str_name, $uploaddir = "/uploads/") {
        $img = $uploaddir . $str_name;
        $exif = exif_read_data($img);
        // получение нового размера
        list($width, $height) = @getimagesize($img);
        $img = @imagecreatefromjpeg($img);

        if (!empty($exif['Orientation'])) {
            switch ($exif['Orientation']) {
                case 8:
                    $img = imagerotate($img, 90, 0);
                    $width = $exif['COMPUTED']['Height'];
                    $height = $exif['COMPUTED']['Width'];
                    break;
                case 3:
                    $img = imagerotate($img, 180, 0);
                    break;
                case 6:
                    $img = imagerotate($img, -90, 0);
                    $width = $exif['COMPUTED']['Height'];
                    $height = $exif['COMPUTED']['Width'];
                    break;
            }
        }

        // аналогичная картинка, больше разрешением для реального масштабирования, а не превью
        $w = 1080; $h = 1080;
        // получение нового размера
        if ($height > $width) {
            $ratio = $h / $height;
        } else {
            $ratio = $w / $width;
        }
        $newwidth  = round( $width  * $ratio );
        $newheight = round( $height * $ratio );
        $bg2 = @imagecreatetruecolor($newwidth, $newheight);
        // изменение размера
        @imagecopyresized($bg2, $img, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
        @imagejpeg($bg2, $uploaddir . "big_pre_" . $str_name, 90);

        // превью для масштабирования
        $w = 540; $h = 540;
        if ($height > $width) {
            $ratio = $h / $height;
        } else {
            $ratio = $w / $width;
        }
        $newwidth  = round( $width  * $ratio );
        $newheight = round( $height * $ratio );

        define("AVATAR_UPLOAD_WIDTH", $newwidth);
        define("AVATAR_UPLOAD_HEIGHT", $newheight);

        $bg1 = @imagecreatetruecolor($newwidth, $newheight);
        // изменение размера
        @imagecopyresized($bg1, $img, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);

        // Вывод и освобождение памяти
        if ( @imagejpeg($bg1, $uploaddir . "pre_" . $str_name, 90) ) {
            $rez = $uploaddir . "pre_" . $str_name;
        } else {
            $rez = "Error Fix";
        }

        @imagedestroy($img);
        @imagedestroy($bg1);
        @imagedestroy($bg2);

        return $rez;
    }

	// валидация форматов изобржений
	$valid_formats = array("jpg", "png", "gif", "jpeg");
	$result = "";
	$img_original = "";
	$img_final = "";
	$message = "";

	if (isset($_POST) and $_SERVER['REQUEST_METHOD'] == "POST") {
		$uploaddir = "uploads/"; //Каталог для загрузки фото
		foreach ($_FILES["photos"]["name"] as $name => $value) {
			$filename = stripslashes($_FILES["photos"]["name"][$name]);
			$size=filesize($_FILES["photos"]["tmp_name"][$name]);
			// конвертация расширения изображений к нижнему регистру
			$ext = getExtension($filename);
			$ext = strtolower($ext);
			// проверка расширения
			if(in_array($ext, $valid_formats)) {
				// проверка размера файла
				if ($size < (MAX_SIZE*1024)) {
					$image_name = time() . $filename;
					// перемещение файла в папку uploads
					if (move_uploaded_file($_FILES["photos"]["tmp_name"][$name], $uploaddir.$image_name)) {
						$str = fixFirstImg($image_name, $uploaddir);
						if ($str !== "Error Fix") {
							$result = "success";
							$img_original = $uploaddir.$image_name;
							$img_final = $str;
							$message = "";
						} else {
							$result = "error";
							$message = "Error Fix";
						}
					} else {
						$result = "error";
						$message = "Moving unsuccessful!";
					}
				} else {
					$result = "error";
					$message = "You have exceeded the size limit!";
				}
			} else {
				$result = "error";
				$message = "Unknown extension!";
			}
		} // конец foreach
	} ?>
	{
        "result": "<?= $result; ?>",
        "img_original": "<?= $img_original; ?>",
        "img_final": "<?= $img_final; ?>",
        "img_width": "<?= AVATAR_UPLOAD_WIDTH; ?>",
        "img_height": "<?= AVATAR_UPLOAD_HEIGHT; ?>",
        "message": "<?= $message; ?>"
    }