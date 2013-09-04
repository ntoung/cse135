 <?php 
  
 require 'connect.php';
 require 'functions.php';

 
 /*
 echo $rtype; 
 $what = switchtable($rtype);
 
*/

 

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
	
	if(!checkEmail($_POST['email']))
	{
		$err[]='Your email is not valid!';
	//	echo 'Your email is not valid!<br>';
	}

	
	if(!count($err))
	{
		// If there are no errors
		
	//	$pass = substr(md5($_SERVER['REMOTE_ADDR'].microtime().rand(1,100000)),0,6);
		// Generate a random password
		
		$_POST['email'] = mysql_real_escape_string($_POST['email']);
		$_POST['username'] = mysql_real_escape_string($_POST['username']);
		$_POST['fname'] = mysql_real_escape_string($_POST['fname']);
		$_POST['lname'] = mysql_real_escape_string($_POST['lname']);
		// Escape the input data
		
	$rtable = switchtable($rtype);


		$works=mysql_query("	INSERT INTO $rtable (login,pw,email,fname,lname) VALUES (
						
						
							'".$_POST['username']."',
							'".$_POST['password']."',
							'".$_POST['email']."',
							'".$_POST['fname']."',
							'".$_POST['lname']."'
							
							
						);");
						
		
		if(mysql_affected_rows($link)==1)
		{
					echo 'Account created!';
					header("Location: ../login.html");
		}
		
		else {
			echo 'failed!';
			$err[]='This username is already taken!';
			}
	}

	if(count($err))
	{
	echo '<strong> Account creation failed!  </strong><br><br>';
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
User Name: <?php echo $_POST["username"]; ?><br/>
Password: <?php echo $_POST["password"]; ?><br/>
First Name: <?php echo $_POST["fname"]; ?><br/>
Last Name: <?php echo $_POST["lname"]; ?><br/>
Email: <?php echo $_POST["email"]; ?>


<?php
//Author: Michael Yao
?>
