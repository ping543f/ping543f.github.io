<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/bootstrap.css">
    <link rel="stylesheet" href="css/bootstrap-theme.css">
    <style>
    .middle{
            width:90%;
            padding-left:5%;
            padding-right:5%;

            margin:5%;
    }

    </style>
    <meta http-equiv="Content-Type"  content="text/html charset=UTF-8" />
</head>
<body class="container middle">
<hr>
<h2>Character Frequency Count</h2>
<hr>
<?php
    $str = utf8_encode($_POST["freq_string"]);

    $strArray = count_chars($str,1);
    echo "<table class='table table-striped table-condensed'>";
    echo "<tr><th>Character</th><th>Count</th></tr>";
    foreach ($strArray as $key=>$value)
    {
        echo "<tr><td>".chr(utf8_decode($key))."</td><td> $value </td></tr>";
    }
    echo "</table>";
    echo "<br><a href='index.php'class='btn btn-primary'>Input Another String</a>";

    echo "<hr>";
    echo "<h3> Word Count</h3>";
    echo "<hr>";

    echo "<table class='table table-striped table-condensed'>";
    echo "<tr><th>Word</th><th>Count</th></tr>";

    $words = explode(" ", $str);
    $result = array_combine($words, array_fill(0, count($words), 0));

    foreach($words as $word) {
        $result[$word]++;
    }

    foreach($result as $word => $count) {
        //echo "There are $count instances of $word.\n";
        echo "<tr><td>".utf8_decode($word)."</td><td> $count </td></tr>";
    }
    echo "</table>";
    echo "<br><a href='index.php'class='btn btn-primary'>Input Another String</a>";

?>

</body>
</html>
