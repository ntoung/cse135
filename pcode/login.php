<?php
  require '../../connect.php';
  require 'functions.php';

  session_start();
  $err = array();
	
	if(strlen($_POST['username'])<4 || strlen($_POST['username'])>32)
	{
		$err[]='Your username must be between 3 and 32 characters!';
		//echo 'Your username must be between 3 and 32 characters!<br>';
	}
	
	if(preg_match('/[^a-z0-9\-\_\.]+/i',$_POST['username']))
	{
		$err[]='Your username contains invalid characters!';
		//echo 'Your username contains invalid characters!<br>';
	}

  	$tmpUser = strip_tags($_POST['username']);

	if( strcmp($tmpUser, $_POST['username']) != 0)
	{
		$err[]='Your username contains tags!';
	}	
	
	$tmpPass = strip_tags($_POST['password']);

        if( strcmp($tmpPass, $_POST['password']) != 0) 
        {
                $err[]='Your password contains tags!';
        } 

	if(count($err))
	{
	echo '<strong> Account login failed!  </strong><br><br>';
		$_SESSION['msg']['reg-err'] = implode('<br />',$err);
		echo implode('<br />',$err);
	}
	
  $text = strip_tags($_POST["username"]);

  $ltable = switchtable($ltype);
  $query = "SELECT * FROM $ltable WHERE login = '$tmpUser' AND pw ='$tmpPass';";
  $result = mysql_query($query);
  $numAccts = mysql_num_rows($result);
       if ($numAccts == 0)
 	{      
  		print ("<tr><td>No accts</td></tr>");
        }

	if(mysql_affected_rows($link)==1)
	{
		echo 'login without any problem';
                $row = mysql_fetch_array($result,MYSQL_NUM);
  		$_SESSION['account_data'] = $query;
		$_SESSION['account_type'] = $ltable;
		header("Location: ../template.html");
	}
 
?>
<br/>
User Name: <?php echo $text; ?>
<br/>
Password: <?php echo $_POST["password"]; ?>
 <br/>
<br>
<a href="http://s7.level3.pint.com">Click here to access the main page</a>
<br/>
<a href="http://s7.level3.pint.com/login.html">Click here to access the login page</a>
<br/>

<?php
//Author: Michael Yao, bryant lin
?>
