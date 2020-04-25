<!DOCTYPE html>
<html lang="PL-pl">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width initial-scale=1 minimum-scale=1" />
</head>

<body> 
    <?php
        $userAgent = $_SERVER['HTTP_USER_AGENT'];
		
		if(preg_match('/windows/i', $userAgent)){
			header("Location:"."default.html");
		}
		
		elseif(preg_match('/android/i', $userAgent)){
			header("Location:"."android.html");
		}
		
		elseif(preg_match('/ios/i', $userAgent)){
			header("Location:"."ios.html");
		}
    ?>
</body>
</html>
