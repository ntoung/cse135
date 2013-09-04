 <?php
 
 $link = mysql_connect("s7.level3.pint.com", "bryant", "");
 
 if (!$link) {
    die('Not connected : ' . mysql_error());
}

$db_selected = mysql_select_db('135database', $link);

if (!$db_selected) {
    die ('Can\'t use foo : ' . mysql_error());
}
  ?>