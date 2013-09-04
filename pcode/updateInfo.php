 <?php 
  
 require '../../connect.php';
 require 'functions.php';
 session_start(); 
 /*
 echo $rtype; 
 $what = switchtable($rtype);
 
*/

 

$err = array();
	
	if(strlen($_POST['editfname'])<=0 || strlen($_POST['editfname'])>32)
	{
		$err[]='Your first name must be between 1 and 32 characters!';
		//echo 'Your username must be between 3 and 32 characters!<br>';
	}

	if(strlen($_POST['editlname'])<=0 || strlen($_POST['editlname'])>32)
        {
                $err[]='Your last name must be between 1 and 32 characters!';
                //echo 'Your username must be between 3 and 32 characters!<br>';
        }
	
	if( !checkEmail( $_POST['editemail'] ) )
	{
		$err[]='Your email is not valid!';
	}

	$tmpfname = strip_tags($_POST['editfname']);
        if( strcmp($tmpfname, $_POST['editfname']) != 0)
        {
                $err[]='Your first name contains tags!';
        }

	$tmplname = strip_tags($_POST['editlname']);

        if( strcmp($tmplname, $_POST['editlname']) != 0)
        {
                $err[]='Your last name contains tags!';
        }

	if(!count($err))
	{
		// If there are no errors
		
		$email = $_POST['editemail'];
		$fname = $tmpfname;
		$lname = $tmplname;
		$query      = $_SESSION['account_data'];
  		$result = mysql_query($query);
  		$tmp = mysql_fetch_array($result,MYSQL_NUM);
		$user_name      = $tmp[1];
		$user_pw	= $tmp[2];
	   	$type		= $_SESSION['account_type'];	
		// Escape the input data
		
		$query  = "UPDATE $type SET fname='$fname', lname='$lname', email='$email'
			   WHERE login='$user_name' AND pw='$user_pw';";
		$works=mysql_query($query);

		header("Location: ../template.html");
		
	}
	if(count($err))
	{
	echo '<strong> Edit failed!  </strong><br><br>';
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
