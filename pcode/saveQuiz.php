<?php 
	require '../../connect.php';
	session_start();

	$quiz_string=$_POST['quiz_contents'];
	$quiz_name=$_POST['quizName'];

	echo "$quiz_string";
	# $data = json_decode($_POST['quiz']);
	# mysqli_query($con,"INSERT INTO tq_relate (qid, qnum, qtype) VALUES ($data[0], $data[1], $data[2])");

	$query = "INSERT INTO quiz_info (JSONString) VALUES ('$quiz_string');";	
  	$result = mysql_query($query);

?>
