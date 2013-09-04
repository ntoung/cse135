 <?php 
  
 require '../../connect.php';
 require 'functions.php';
 session_start(); 
 /*
 echo $rtype; 
 $what = switchtable($rtype);
 
*/

 

$err = array();
	
	if(strlen($_POST['username'])<=0 || strlen($_POST['username'])>32)
	{
		$err[]='Your name must be between 1 and 32 characters!';
		//echo 'Your username must be between 3 and 32 characters!<br>';
	}

	if( !checkEmail( $_POST['email'] ) )
	{
		$err[]='Your email is not valid!';
	}

	$tmpname = strip_tags($_POST['username']);
        if( strcmp($tmpname, $_POST['username']) != 0)
        {
                $err[]='Your name contains tags!';
        }
	$empty = '';
	$type  = $_POST['myRadio'];
	if( strcmp($type, $empty) == 0) 
	{
                $err[]='Your type is empty!';
	} 
	if(!count($err))
	{
		// If there are no errors
		
		$email = $_POST['email'];
		$query      = "SELECT pw FROM $type WHERE login='$tmpname' AND email='$email';";
  		$result = mysql_query($query);
  		$tmp = mysql_fetch_array($result,MYSQL_NUM);
		// Escape the input data
		
$_SESSION['password'] = "$tmp[0]";
		header("Location: ../passwordAnswer.html");
		
	}
	if(count($err))
	{
	echo '<strong> Get password failed!  </strong><br><br>';
		$_SESSION['msg']['reg-err'] = implode('<br />',$err);
		echo implode('<br />',$err);
	}	
	
 ?>
<br/>
<br>
<a href="http://s7.level3.pint.com">Click here to access the main page</a>
<br/>
<a href="http://s7.level3.pint.com/login.html">Click here to access the login page</a>
<br/>
WRONG INFO, GO BACK AND CHANGE


<?php
//Author: Michael Yao
?>
